import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { testCategories, testPlacemarks, river, liffey, testUsers, maggie} from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("Category Model tests", () => {
 let bodyOfWater = null;
  setup(async () => {
    
    db.init();
     await db.categoryStore.deleteAllCategories();
     await db.placemarkStore.deleteAllPlacemarks();
     bodyOfWater = await db.categoryStore.addCategory(river);
     for (let i = 0; i < testPlacemarks.length; i += 1) {
    testPlacemarks[i] = await db.placemarkStore.addPlacemark(bodyOfWater._id, testPlacemarks[i]);
    }
    
  });

  test("create a placemark", async () => {
    const returnedPlacemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, liffey);
    assert.isNotNull(returnedPlacemark)
    assertSubset(liffey, returnedPlacemark);
   
  });
 
   test("create multiple placemarks", async () => {
     const placemarks = await db.placemarkStore.getPlacemarkByCategoryId(bodyOfWater._id);
     assert.equal(testPlacemarks.length, placemarks.length);
    
    });

    test("delete all placemarks", async () => {
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(allPlacemarks.length, testPlacemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    const deletedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(deletedPlacemarks, 0);
 
  });

   test("delete a single placemark", async () => {
    
 
  });

  test("get a placemark by Id - success", async () => {
   const placemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, liffey);
   const returnedPlacemark = await db.placemarkStore.getPlacemarkById(liffey._id);
   assertSubset(liffey, returnedPlacemark); 
  });


   test("get a placemark by Id - failure", async () => {
   const placemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, liffey);
   const returnedPlacemark = await db.placemarkStore.getPlacemarkById("123");
   assert.isNull(returnedPlacemark);
  });

   test("get placemark with categoryId - success", async () => {
   const placemarks = await db.placemarkStore.getCategoryPlacemarks(bodyOfWater._id);
   assert.deepEqual(placemarks.length, testPlacemarks.length);
  });

  test("get placemark with categoryId - failure", async () => {
   const placemarks = await db.placemarkStore.getCategoryPlacemarks("123");
   assert.deepEqual(placemarks.length, 0);
  });

  });