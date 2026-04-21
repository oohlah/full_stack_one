import Mongoose from "mongoose";
import { Category, Placemark } from "../../types/object-types.js";
import { CategoryMongoose } from "./category.js";
import { placemarkMongoStore } from "./placemark-mongo-store.js";


export const categoryMongoStore = {
  async getAllCategories(): Promise<Category[]> {
    const categories = await CategoryMongoose.find().lean();
    
    return categories.map((c) => ({
    ...c,
    _id: c._id.toString(),
    userid: c.userid.toString(),
  }));
  },

  async getCategoryById(id: string): Promise<Category | null> {
    if (Mongoose.isValidObjectId(id)) {
      const category = await CategoryMongoose.findOne({ _id: id }).lean();
      if (!category) {
         return null;
      }
    const placemarksRaw = await placemarkMongoStore.getPlacemarksByCategoryId(
  category._id.toString()
);

const placemarks: Placemark[] = placemarksRaw.map((p) => ({
  ...p,
  _id: p._id.toString(),
  categoryid: p.categoryid.toString(),
}));

  return {
    _id: category._id.toString(),
    title: category.title,
    img: category.img,
    userid: category.userid.toString(),
    placemarks,
  } as unknown as Category;
  }
  return null; 
},

  async addCategory(category: Category): Promise<Category | null> {
    const newCategory = new CategoryMongoose(category);
    const categoryObj = await newCategory.save();
    return this.getCategoryById(categoryObj._id.toString());
  },

  async getUserCategories(id: string): Promise<Category[]> {
    const categories = await CategoryMongoose.find({ userid: id }).lean();
    return categories.map((c) => ({
    ...c,
    _id: c._id.toString(),
    userid: c.userid.toString(),
  }));
  },

  async deleteCategoryById(id: string) {
    try {
      await CategoryMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

  async deleteAllCategories() {
    await CategoryMongoose.deleteMany({});
  },
   async updateCategory(updatedCategory: Category) {
    const category = await CategoryMongoose.findOne({ _id: updatedCategory._id });

  if (!category) {
    return; // or throw error
  }

  category.title = updatedCategory.title;
  category.img = updatedCategory.img;

  await category.save();
  },
};
