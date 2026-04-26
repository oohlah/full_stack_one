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
  try {
    if (!categoryid) throw new Error("Missing categoryid");
    if (!placemark.name) throw new Error("Missing placemark name");
    if (!placemark.description) throw new Error("Missing description");

     const placemarkData: FirebasePlacemark = {
      name: placemark.name,
      description: placemark.description,
      categoryid,
      created: Date.now()
    };


    if (placemark.location) {
      placemarkData.location = placemark.location;
    }

   if (placemark.temp != null) {
  placemarkData.temp = placemark.temp;
}

if (placemark.wind != null) {
  placemarkData.wind = placemark.wind;
}

    console.log("PLACEMARK INTO FIRESTORE:", placemarkData);

    const docRef = await placemarkCollection.add(placemarkData);

    return {
      _id: docRef.id,
      ...placemarkData
    };

  } catch (error) {
    console.error("Error creating placemark:", error);
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