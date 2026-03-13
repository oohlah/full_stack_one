import { firestore } from "./firebase.js";
// no schema import

const userCollection = firestore.collection("users");

export const userFirebaseStore = {
    

async getAllUsers(){
  try {
    // await query snapshot
    const snapshot = await userCollection.get();
    if (snapshot.empty) {
      console.log("No matching users.");
      return [];
    }
    
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
    // returns tranformed document into a javascript object
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting users: ", error);
    return [];
  }
},

async getUserById(id) {
  try {
    const docRef = userCollection.doc(id);
    const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      console.log(`User data for ${id}:`, docSnapshot.data());
       const user =  { _id: docSnapshot.id, ...docSnapshot.data() };
      return user;
    } 
      console.log(`No such user: ${id}`);
      return null;
    
  } catch (error) {
    console.error("Error getting user: ", error);
    return null;
  }
},
async addUser(user) {
    try {
    const docRef = userCollection.doc(); // create id
    user._id = docRef.id;
    await docRef.set(user);
    return user;

  } catch (error) {
    console.error("Error creating user: ", error);
     throw error;
  }

},

async getUserByEmail(email){
  try {
    const snapShot = await userCollection.where("email", "==", email).get();
    
    if (snapShot.empty) {
      console.log(`No such user with email: ${email}`);
      return null;
    } 
     const doc = snapShot.docs[0];
     const user = { _id: doc.id, ...doc.data() };
     console.log(`User data for ${email}:`, user);
     return user;
    
  } catch (error) {
    console.error("Error getting user by email: ", error);
    return null;
  }

},

async deleteUserById(id) {
    try {
    await userCollection.doc(id).delete();
    console.log(`User ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
},

 async deleteAll() {
    // get all user documents
    const snapshot = await userCollection.get();
    // create a batch
    const batch = firestore.batch();

   // loop through each doc to queue delete 
    snapshot.forEach(doc => {
     batch.delete(doc.ref); 
    });

 try{
    await batch.commit(); // commit all delete
    console.log("all users delete")
  } catch (error){
    console.error("Error deleting users", error)
  }
}
};

