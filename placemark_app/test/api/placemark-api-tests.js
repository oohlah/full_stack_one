import { assert } from "chai";
import { assertSubset } from "../test-utils.js";
import { placemarkService } from "./placemark-service.js";
import { maggie, river, testCategories, testPlacemarks, liffey } from "../fixtures.js";

suite("Placemark API tests", () => {
  let localMaggie = null;
  let bodyOfWater = null;

  setup(async () => {
    await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllPlacemarks();
    await placemarkService.deleteAllUsers();
    localMaggie = await placemarkService.createUser(maggie);
    river.userid= localMaggie._id;
    bodyOfWater = await placemarkService.createCategory(river);
    

  });

  teardown(async () => {});

  test("create placemark", async () => {
    const returnedPlacemark = await placemarkService.createPlacemark(bodyOfWater._id, liffey);
    assertSubset(returnedPlacemark, liffey);
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
  });

  test("test denormalised category", async () => {
  });
});
