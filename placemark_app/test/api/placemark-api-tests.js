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
  });

  test("Delete placemark", async () => {
  });

  test("test denormalised category", async () => {
  });
});
