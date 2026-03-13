import { userMemStore } from "./mem/user-mem-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js"
import { placemarkMemStore } from "./mem/placemark-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { placemarkJsonStore } from "./json/placemark-json-store.js";
import { categoryJsonStore } from "./json/category-json-store.js";
import { userMongoStore } from "./mongo/user-mongo-store.js";
import { categoryMongoStore } from "./mongo/category-mongo-store.js";
import { placemarkMongoStore } from "./mongo/placemark-mongo-store.js";
import { connectMongo } from "./mongo/connect.js";
import { userFirebaseStore } from "./firebase/user-firebase-store.js";
import { categoryFirebaseStore } from "./firebase/category-firebase-store.js";
import { placemarkFirebaseStore } from "./firebase/placemark-firebase-store.js";


export const db = {
  userStore: null,
  categoryStore: null,
  placemarkStore: null,

    init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.placemarkStore = placemarkJsonStore;
        this.categoryStore = categoryJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.categoryStore = categoryMongoStore;
        this.placemarkStore = placemarkMongoStore;
        connectMongo();
        break;
       case "firebase" :
         this.userStore = userFirebaseStore;
         this.categoryStore = categoryFirebaseStore;
         this.placemarkStore = placemarkFirebaseStore;
        break;
      default :
       this.userStore = userMemStore;
       this.categoryStore = categoryMemStore;
       this.placemarkStore = placemarkMemStore;
  }
}
};
