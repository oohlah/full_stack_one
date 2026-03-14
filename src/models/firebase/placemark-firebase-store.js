import { firestore } from "./firebase.js";

const placemarkCollection = firestore.collection("placemarks");

export const placemarkFirebaseStore = {

async getAllPlacemarks(){
  try {
    // await query snapshot
    const snapshot = await placemarkCollection.get();
    if (snapshot.empty) {
      console.log("No matching placemarks.");
      return [];
    }
    
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data());
    });
 // returns tranformed document into a javascript object
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error("Error getting placemarks: ", error);
    return [];
  }
},

async getPlacemarkById(id) {
  try {
      if (!id) return null;
      const docRef = placemarkCollection.doc(id);
      const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      console.log(`Placemark data for ${id}:`, docSnapshot.data());
      const placemark  = { _id: docSnapshot.id, ...docSnapshot.data() };
      return placemark;
          } 
      console.log(`No such placemark: ${id}`);
      return null;
    
  } catch (error) {
    console.error("Error getting placemark: ", error);
    return null;
  }
},

 async getPlacemarksByCategoryId(categoryid) {
  // order by timestamp when multiple objects being returned - ordered
   const snapshot = await placemarkCollection.where("categoryid", "==", categoryid).orderBy("created").get();
   if(snapshot.empty)return[];
   const placemarks = snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));

   return placemarks;
  },

 async addPlacemark(categoryid, placemark) {
    try {
    // remove id if it exists
    const { _id, ...cleanPlacemark } = placemark;

    if (!categoryid) throw new Error("Cannot add placemark without a categoryid");
    // merge categoryid with placemark
    const placemarkData = {...cleanPlacemark, categoryid: categoryid, created: Date.now()};  
    const docRef = await placemarkCollection.add(placemarkData);
    console.log("Placemark created with ID: ", docRef.id);
    return { _id: docRef.id, ...placemarkData };
    
  } catch (error) {
    console.error("Error creating placemark: ", error);
     throw error;
  }

},

async updatePlacemark(id, payload){
try{ 
  const userRef = placemarkCollection.doc(id);
  await userRef.update(payload); // only updates details provided
  const updatedSnapshot = await userRef.get();
  if(updatedSnapshot.exists){
    const updatedPlacemark = { _id: updatedSnapshot.id, ...updatedSnapshot.data() };
    return updatedPlacemark;
  }
  return null;
 } catch (err) {
    console.error("Firestore update error:", err);
    throw err;
  }
},
async deletePlacemark(id) {
    try {
    if (!id) return; 
    await placemarkCollection.doc(id).delete();
    console.log(`Placemark ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting placemark: ", error);
  }
},
async deleteAllPlacemarks() {
    // get all user documents
    const snapshot = await placemarkCollection.get();
    // create a batch
    const batch = firestore.batch();

   // loop through each doc to queue delete 
    snapshot.forEach(doc => {
     batch.delete(doc.ref); 
    });

 try{
    await batch.commit(); // commit all delete
    console.log("all placemarks deleted")
  } catch (error){
    console.error("Error deleting placemarks", error)
  }
}


}