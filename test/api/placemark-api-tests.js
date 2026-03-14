import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, river, testCategories, testPlacemarks, liffey } from "../fixtures.js";

suite("Placemark API tests", () => {
  let user = null;
  let bodyOfWater = null;

  setup(async () => {
    placemarkService.clearAuth();
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    river.userid= user._id;
    bodyOfWater = await placemarkService.createCategory(river);
     // make sure all placemarks have the correct _id - don't let firestore assign it
   liffey.categoryid = bodyOfWater._id;
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      testPlacemarks[i].categoryid = bodyOfWater._id;
    }
   

  });

  teardown(async () => {});

  test("create placemark", async () => {
    const returnedPlacemark = await placemarkService.createPlacemark(bodyOfWater._id, liffey);
    assertSubset(liffey, returnedPlacemark);
  });

  test("create Multiple placemarks", async () => {
     for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(bodyOfWater._id, testPlacemarks[i]);
    }
    const returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, testPlacemarks.length);
    for (let i = 0; i < returnedPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      const placemark = await placemarkService.getPlacemark(returnedPlacemarks[i]._id);
      assertSubset(placemark, returnedPlacemarks[i]);
    }
  });

  test("Delete placemark", async () => {
     for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(bodyOfWater._id, testPlacemarks[i]);
    }
    let returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(testPlacemarks.length, returnedPlacemarks.length);

    
    for (let i = 0; i < returnedPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.deletePlacemark(returnedPlacemarks[i]._id);
      
    }
    returnedPlacemarks = await placemarkService.getAllPlacemarks();
    assert.equal(returnedPlacemarks.length, 0);
    
  });

  test("test denormalised category", async () => {
    await placemarkService.deleteAllPlacemarks();
      for (let i = 0; i < testPlacemarks.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createPlacemark(bodyOfWater._id, testPlacemarks[i]);
    }
    const returnedCategory = await placemarkService.getCategory(bodyOfWater._id);
    assert.equal(returnedCategory.placemarks.length, testPlacemarks.length);
    console.log("RETURNED: ",returnedCategory);
    console.log("TEST PLACEMARKS",testPlacemarks);
    for (let i = 0; i < testPlacemarks.length; i += 1) {
      assertSubset(testPlacemarks[i], returnedCategory.placemarks[i]);
    }
       
    });

       test("update placemark - success", async () => {
       const placemark = await placemarkService.createPlacemark(bodyOfWater._id, liffey);
        console.log("PLACEMARK: ", placemark);
      // name and description to be updated to..
      const updates = {
        name: "The Dargle",
        description: "It's in Wicklow"
      };
    
      try{
      await placemarkService.updatePlacemark(placemark._id, updates);
      } catch (err) {
         console.error("UPDATE ERROR:", err);
           throw err;
}
      // get the updated placemark
       const returnedPlacemark = await placemarkService.getPlacemark(placemark._id);
      console.log("RETURNED:", returnedPlacemark);
      assertSubset(updates, returnedPlacemark);
      });
});
