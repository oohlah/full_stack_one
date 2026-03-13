/* eslint-disable no-await-in-loop */
import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { testCategories, testPlacemarks, river, liffey, testUsers, maggie} from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Placemark Model tests", () => {
 let bodyOfWater = null;
  setup(async () => {
    
    db.init("mem");
     await db.categoryStore.deleteAllCategories();
     await db.placemarkStore.deleteAllPlacemarks();
     bodyOfWater = await db.categoryStore.addCategory(river);
     for (let i = 0; i < testPlacemarks.length; i += 1) {
    testPlacemarks[i] = await db.placemarkStore.addPlacemark(bodyOfWater._id, testPlacemarks[i]);
    }
    
  });

  test("create a placemark", async () => {
    await db.placemarkStore.deleteAllPlacemarks();
    // copy liffey fixture - firestore is giving it an _id
    const freshPlacemark = { ...liffey};
    // if freshPlacemark has an _id remove it
    if(freshPlacemark._id){delete freshPlacemark._id;}
    // give it the same categoryid as bodyOfWater._id
    freshPlacemark.categoryid = bodyOfWater._id;
    const returnedPlacemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, freshPlacemark);
    
    assert.isNotNull(returnedPlacemark._id)
    // compare subset with same id as superset 
    assertSubset(freshPlacemark, returnedPlacemark);
    
   
  });
 
   test("create multiple placemarks", async () => {
     const placemarks = await db.placemarkStore.getPlacemarksByCategoryId(bodyOfWater._id);
     assert.equal(testPlacemarks.length, placemarks.length);
    
    });

    test("delete all placemarks", async () => {
    const allPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(allPlacemarks.length, testPlacemarks.length);
    await db.placemarkStore.deleteAllPlacemarks();
    const deletedPlacemarks = await db.placemarkStore.getAllPlacemarks();
    assert.equal(deletedPlacemarks, 0);
 
  });

   test("delete a single placemark - success", async () => {
    const placemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, liffey);
    await db.placemarkStore.deletePlacemark(placemark._id);
    const deletedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
    assert.isNull(deletedPlacemark);
 
  });

  test("delete a single placemark - failure", async () => {
   const deletedPlacemark = await db.placemarkStore.getPlacemarkById("123");
    assert.isNull(deletedPlacemark);
 
  });

  test("get a placemark by Id - success", async () => {
   const placemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, liffey);
   const returnedPlacemark = await db.placemarkStore.getPlacemarkById(placemark._id);
   console.log("LIFFEY:", liffey);
   console.log("RETURNED: ", returnedPlacemark);
   assertSubset(liffey, returnedPlacemark); 
  });


   test("get a placemark by Id - failure", async () => {
   const placemark = await db.placemarkStore.addPlacemark(bodyOfWater._id, liffey);
   const returnedPlacemark = await db.placemarkStore.getPlacemarkById("123");
   assert.isNull(returnedPlacemark);
  });

   test("get placemark with categoryId - success", async () => {
   const placemarks = await db.placemarkStore.getPlacemarksByCategoryId(bodyOfWater._id);
   assert.strictEqual(placemarks.length, testPlacemarks.length);
  });

  test("get placemark with categoryId - failure", async () => {
   const placemarks = await db.placemarkStore.getPlacemarksByCategoryId("123");
   assert.strictEqual(placemarks.length, 0);
  });

  });