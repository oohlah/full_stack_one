import { firestore } from "./firebase.js";
import { Placemark, PlacemarkCreate, FirebasePlacemark,  FirebasePlacemarkDoc } from "../../types/object-types.js"

const placemarkCollection = firestore.collection("placemarks");

export const placemarkFirebaseStore = {

async getAllPlacemarks(): Promise<Placemark[] | FirebasePlacemarkDoc[]>{
  try {
    // await query snapshot
    const snapshot = await placemarkCollection.get();
    if (snapshot.empty) {
      console.log("No matching placemarks.");
      return [];
    }
    
    snapshot.forEach((doc) => {
      console.log(doc.id, "=>", doc.data() as FirebasePlacemark);
    });
 // returns tranformed document into a javascript object
    return snapshot.docs.map(doc => ({ _id: doc.id, ...doc.data() as FirebasePlacemark }));
  } catch (error) {
    console.error("Error getting placemarks: ", error);
    return [];
  }
},

async getPlacemarkById(id: string): Promise<FirebasePlacemark | FirebasePlacemarkDoc | null> {
  try {
      if (!id) return null;
      const docRef = placemarkCollection.doc(id);
      const docSnapshot = await docRef.get();

    if (docSnapshot.exists) {
      console.log(`Placemark data for ${id}:`, docSnapshot.data());
      const placemark  = { _id: docSnapshot.id, ...docSnapshot.data() as FirebasePlacemark};
      return placemark;
          } 
      console.log(`No such placemark: ${id}`);
      return null;
    
  } catch (error) {
    console.error("Error getting placemark: ", error);
    return null;
  }
},

 async getPlacemarksByCategoryId(categoryid: string): Promise<FirebasePlacemarkDoc[]> {
  // order by timestamp when multiple objects being returned - ordered
   const snapshot = await placemarkCollection.where("categoryid", "==", categoryid).orderBy("created").get();
   if(snapshot.empty)return[];
   return snapshot.docs.map(doc => ({
    _id: doc.id,
    ...(doc.data() as FirebasePlacemark)
  }));
 
  },

 async addPlacemark(categoryid: string, placemark: PlacemarkCreate): Promise<Placemark> {
    
    // remove id if it exists
    // const { _id, ...cleanPlacemark } = placemark;

    // if (!categoryid) throw new Error("Cannot add placemark without a categoryid");
    // // merge categoryid with placemark
    // const placemarkData = {...cleanPlacemark, categoryid: categoryid, created: Date.now()};  
    // const docRef = await placemarkCollection.add(placemarkData);
    // console.log("Placemark created with ID: ", docRef.id);
    // return { _id: docRef.id, ...placemarkData };
     try {

    const cleanPlacemark = placemark;

    if (!categoryid) throw new Error("Cannot add placemark without a categoryid");

    const placemarkData = {
      ...cleanPlacemark,
      categoryid,
      created: Date.now()
    };

    const docRef = await placemarkCollection.add(placemarkData);

    console.log("Placemark created with ID: ", docRef.id);

    return {
      _id: docRef.id,
      ...placemarkData
    };
    
  } catch (error) {
    console.error("Error creating placemark: ", error);
     throw error;
  }

},

async updatePlacemark(id: string, payload: any): Promise<FirebasePlacemarkDoc | null>{
try{ 
  const userRef = placemarkCollection.doc(id);
  await userRef.update(payload); // only updates details provided
  const updatedSnapshot = await userRef.get();
  if(updatedSnapshot.exists){
    const updatedPlacemark = { _id: updatedSnapshot.id, ...updatedSnapshot.data() as FirebasePlacemark };
    return updatedPlacemark;
  }
  return null;
 } catch (err) {
    console.error("Firestore update error:", err);
    throw err;
  }
},
async deletePlacemark(id: string) {
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