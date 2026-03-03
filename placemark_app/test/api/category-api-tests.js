import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, river,testCategories } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

suite(" Category Api tests", () => {
    let user = null;
  setup(async () => {
    await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    
  });
  teardown(async () => {
  });
 
    test("create category", async () => {
    const returnedCategory = await placemarkService.createCategory(river);
    assert.isNotNull(returnedCategory);
    assertSubset(river, returnedCategory);
  });

  test("delete a category", async () => {
  });

  test("create multiple categories", async () => {
  });

  test("remove non-existant category", async () => {
  });

  });