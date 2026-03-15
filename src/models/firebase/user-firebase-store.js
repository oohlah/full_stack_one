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
    console.log("ADDING USER TO FIRESTORE:", user);

     if (!user.scope) {
      user.scope = "user"; // normal user
    }
  
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

async updateUserName(id, payload){
    
  const userRef = userCollection.doc(id);
  await userRef.update(payload); // only updates details provided
  const updatedSnapshot = await userRef.get();
  if(updatedSnapshot.exists){
    const updatedUser = { _id: updatedSnapshot.id, ...updatedSnapshot.data() };
    return updatedUser;
  }
 return null;
},

async updateUserEmail(id, payload){
    
  const userRef = userCollection.doc(id);
  await userRef.update(payload); // only updates details provided
  const updatedSnapshot = await userRef.get();
  if(updatedSnapshot.exists){
    const updatedUser = { _id: updatedSnapshot.id, ...updatedSnapshot.data() };
    return updatedUser;
  }
 return null;
},

async checkCurrentPassword(currentPassword, userid){

   try {
      // users collection and  doc id
      const userDoc = await userCollection.doc(userid).get();

      if (!userDoc.exists) {
        return false;
      }

      const foundUser = userDoc.data();

      // simple comparison (no bcrypt)
      return currentPassword === foundUser.password;

    } catch (err) {
      console.error("Error checking current password:", err);
      return false;
    }

},

 async updatePassword(newPassword, userid) {
     // user reference
      const userRef = userCollection.doc(userid);
      // get doc from userRef
      const userDoc = await userRef.get();

      if (!userDoc.exists) {
        return false;
      }
      // update password with newPassword
      await userRef.update({ password: newPassword });
      // get updated user object
      const updatedDoc = await userRef.get();
      // return id as _id
      return { _id: updatedDoc.id, ...updatedDoc.data() };
  
    },


async deleteUserById(id) {
    try {
    await userCollection.doc(id).delete();
    console.log(`User ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting user: ", error);
  }
},

  async setAdmin(id) {
  const userRef = userCollection.doc(id);

  // set scope as a string
  await userRef.update({ scope: "admin" });

  const updatedDoc = await userRef.get();
  return { _id: updatedDoc.id, ...updatedDoc.data() };
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

