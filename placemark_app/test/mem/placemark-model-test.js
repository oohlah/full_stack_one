import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategories, testPlacemarks, river, liffey, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category Model tests", () => {
 
  setup(async () => {
    db.init();
     await db.userStore.deleteAll();
     await db.categoryStore.deleteAllCategories();
     await db.placemarkStore.deleteAllPlacemarks();
    for (let i = 0; i < testCategories.length; i += 1) {
    //
    }
  });

  test("create a placemark", async () => {
  
  });




  });