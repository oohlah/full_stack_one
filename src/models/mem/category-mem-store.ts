import { v4 } from "uuid";
import { placemarkMemStore } from "./placemark-mem-store.js";
import { Category, FirebaseCategory } from "../../types/object-types.js";


let categories: Category[] = [];


export const categoryMemStore = {
  async getAllCategories(): Promise<Category[]> {
    return categories;
  },

  async addCategory(category: Category): Promise<Category> {
    category._id = v4();
    categories.push(category);
    return category;
  },

  async getUserCategories(userid: string): Promise<Category[]> {
    return categories.filter((category) => (category as any).userid === userid);
  },

  async getCategoryById(id: string): Promise<Category | null> {
    const list = categories.find((category) => category._id === id);

    if (list) {
      list.placemarks =
        await placemarkMemStore.getPlacemarksByCategoryId(list._id);

      return list;
    }

    return null;
  },

  async deleteCategoryById(id: string) {
    const index = categories.findIndex((category) => category._id === id);
    if(index !== -1){categories.splice(index, 1)};
  },

  async deleteAllCategories() {
    categories = [];
  },
};
