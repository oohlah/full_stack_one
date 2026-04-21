import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { placemarkJsonStore } from "./placemark-json-store.js";
import { Category } from "../../types/object-types.js";

export const categoryJsonStore = {
  async getAllCategories() {
    await db.read();
    return db.data.categories;
  },

  async addCategory(category: Category): Promise<Category> {
    await db.read();
    category._id = v4();
    db.data.categories.push(category);
    await db.write();
    return category;
  },

  async getCategoryById(id: string): Promise <Category | null> {
      await db.read();

      const category = db.data.categories.find(
      (c: Category) => c._id === id
      );

      if (!category) return null;

      category.placemarks = await placemarkJsonStore.getPlacemarksByCategoryId(category._id);

      return category;
  },

  async getUserCategories(userid: string): Promise <Category[]> {
    await db.read();
    return db.data.categories.filter((category: Category) => (category as any).userid === userid);
  },

  async deleteCategoryById(id: string) {
    await db.read();
    const index = db.data.categories.findIndex((category: Category) => category._id === id);
    if(index !== -1){db.data.categories.splice(index, 1)};
    await db.write();
  },

  async deleteAllCategories() {
    db.data.categories = [];
    await db.write();
  },
};
