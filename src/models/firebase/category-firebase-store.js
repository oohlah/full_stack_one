import { firestore } from "./firebase.js";
import { placemarkFirebaseStore } from "./placemark-firebase-store.js";

const categoryCollection = firestore.collection("categories");

export const categoryFirebaseStore = {

async getAllCategories(){
  try {
    // await query snapshot
    const snapshot = await categoryCollection.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }
   // returns tranformed document into a javascript object
   const categories = snapshot.docs.map(doc => ({_id: doc.id,...doc.data(),placemarks: []
    }));
     // get all placemarks
     const placemarks = await placemarkFirebaseStore.getAllPlacemarks();

     for (let i = 0; i< categories.length;i++){
        // filter through placemarks add placemark if categoryid equals category._id
        categories[i].placemarks = placemarks.filter(
            placemark => placemark.categoryid === categories[i]._id);
     };
         return categories;

  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
},
async getCategoryById(id) {
  try {
    const docRef = categoryCollection.doc(id);
    const docSnapshot = await docRef.get();
    if (docSnapshot.exists) {
      console.log(`Category data for ${id}:`, docSnapshot.data());
      const category = { _id: docSnapshot.id, ...docSnapshot.data() };
      const placemarks = await placemarkFirebaseStore.getPlacemarksByCategoryId(id);
      // add placemark propery on to category object
      category.placemarks = placemarks;
      return category;
    } 
      console.log(`No such category: ${id}`);
      return null;
    

  } catch (error) {
    console.error("Error getting category: ", error);
    return null;
  }
},


async addCategory(category) {
    try {
    console.log("category being added:", category, typeof category);
    const docRef = await categoryCollection.add(category);
    return { _id: docRef.id, ...category };
  } catch (error) {
    console.error("Error creating category: ", error);
    return null;
  }

},

async getUserCategories(userid){
  try {
    const snapShot = await categoryCollection.where("userid", "==", userid).get();
    
    if(snapShot.empty) {
      console.log(`No such category with id: ${userid}`);
      return null;
    } 
       console.log(`Category data for user ${userid}:`, snapShot.docs.map(doc => doc.data()));
       // mapping docs into plain javascript objects
      const categories = snapShot.docs.map(doc => ({ _id: doc.id, ...doc.data() }));
       // get all placemarks
     const placemarks = await placemarkFirebaseStore.getAllPlacemarks();
    

     for (let i = 0; i< categories.length;i++){
        // filter through placemarks add placemark if categoryid equals category._id
        categories[i].placemarks = placemarks.filter(
            placemark => placemark.categoryid === categories[i]._id);
     };
        
      return categories;

  } catch (error) {
    console.error("Error getting category by userid: ", error);
    return null;
  }

},

async deleteCategoryById(id) {
    try {
    await categoryCollection.doc(id).delete();
    console.log(`Category ${id} deleted successfully.`);
  } catch (error) {
    console.error("Error deleting category: ", error);
  }
},

async deleteAllCategories() {
    // get all user documents
    const snapshot = await categoryCollection.get();
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