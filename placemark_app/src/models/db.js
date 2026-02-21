import { userMemStore } from "./mem/user-mem-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js"

export const db = {
  userStore: null,
  categoryStore: null,
  

  init() {
    this.userStore = userMemStore;
    this.categoryStore = categoryMemStore;
  },
};
