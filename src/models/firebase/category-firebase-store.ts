import { firestore } from "./firebase.js";
import { placemarkFirebaseStore } from "./placemark-firebase-store.js";
import { Category, Placemark, CategoryWithPlacemarks, FirebaseCategory, FirebaseCategoryDoc } from "../../types/object-types.js";

const categoryCollection = firestore.collection("categories");

export const categoryFirebaseStore = {

async getAllCategories(): Promise<Category[]>{
  try {
    // await query snapshot
    const snapshot = await categoryCollection.get();
    if (snapshot.empty) {
      console.log("No matching documents.");
      return [];
    }
   // returns tranformed document into a javascript object
   const categories = snapshot.docs.map(doc => ({_id: doc.id,...doc.data()  as FirebaseCategory,placemarks: [] as Placemark[] 
    }));
     // get all placemarks
     const placemarks = await placemarkFirebaseStore.getAllPlacemarks() as any;

     for (let i = 0; i< categories.length;i++){
        // filter through placemarks add placemark if categoryid equals category._id
        categories[i].placemarks = placemarks.filter(
            (placemark: any) => placemark.categoryid === categories[i]._id);
     };
         return categories;

  } catch (error) {
    console.error("Error getting documents: ", error);
    return [];
  }
},


async getCategoryById(id: string): Promise<Category | null> {
  try {
    const docRef = categoryCollection.doc(id);
    const docSnapshot = await docRef.get();

    if (!docSnapshot.exists) {
      console.log(`No such category: ${id}`);
      return null;
    }

    const data = docSnapshot.data() as FirebaseCategory;

    const placemarks = await placemarkFirebaseStore.getPlacemarksByCategoryId(id);

    const category: Category = {
      _id: docSnapshot.id,
      ...data,
      placemarks
    };

    return category;

  } catch (error) {
    console.error("Error getting category: ", error);
    return null;
  }
},

async addCategory(category: Category): Promise<Category | null> {
    try {
    console.log("category being added:", category, typeof category);
    const docRef = await categoryCollection.add(category);
    return this.getCategoryById(docRef.id);
    // return { _id: docRef.id, ...category };
  } catch (error) {
    console.error("Error creating category: ", error);
    return null;
  }

},

async getUserCategories(userid: string): Promise<CategoryWithPlacemarks[] | null>{
  try {
    const snapShot = await categoryCollection.where("userid", "==", userid).get();
    
    if(snapShot.empty) {
      console.log(`No such category with id: ${userid}`);
      return null;
    } 
       console.log(`Category data for user ${userid}:`, snapShot.docs.map(doc => doc.data()));
       // mapping docs into plain javascript objects
      // const categories = snapShot.docs.map(doc => ({ _id: doc.id, ...doc.data() as FirebaseCategory}));
      const categories: CategoryWithPlacemarks[] = snapShot.docs.map(doc => ({
      _id: doc.id,
      ...(doc.data() as FirebaseCategory),
      placemarks: []
     }));
       // get all placemarks
     const placemarks = await placemarkFirebaseStore.getAllPlacemarks() as any;
    

     for (let i = 0; i< categories.length;i++){
        // filter through placemarks add placemark if categoryid equals category._id
        categories[i].placemarks = placemarks.filter(

           (placemark: any) => placemark.categoryid === categories[i]._id);
     };
        
      return categories;

  } catch (error) {
    console.error("Error getting category by userid: ", error);
    return null;
  }

},

   async updateCategory(updatedCategory: FirebaseCategoryDoc): Promise<FirebaseCategoryDoc | null> {
   try {
    if (!updatedCategory._id) return null;

    const docRef = categoryCollection.doc(updatedCategory._id);

    // Extract the img field (or any others you want to update later)
    const { img } = updatedCategory;
    const payload: Partial<FirebaseCategory> = {};
    if (img !== undefined) payload.img = img;

    // Only update provided fields
    await docRef.update(payload);

    // Fetch the updated document
    const updatedSnapshot = await docRef.get();
    if (updatedSnapshot.exists) {
      const category = { _id: updatedSnapshot.id, ...updatedSnapshot.data() };


      return {
      _id: updatedSnapshot.id,
      ...(updatedSnapshot.data() as FirebaseCategory)
    };
    }
    return null;

  } catch (error) {
    console.error("Firestore update category error:", error);
    throw error;
  }
},

async deleteCategoryById(id: string) {
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