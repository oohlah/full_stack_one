import { userMemStore } from "./mem/user-mem-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js"
import { placemarkMemStore } from "./mem/placemark-mem-store.js";

export const db = {
  userStore: null,
  categoryStore: null,
  placemarkStore: null,

  init() {
    this.userStore = userMemStore;
    this.categoryStore = categoryMemStore;
    this.placemarkStore = placemarkMemStore;
  },
};
