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
    const category = await placemarkService.createCategory(river);
    const response = await placemarkService.deleteCategory(category._id);
    assert.equal(response.status, 204);
    try {
      const returnedCategory = await placemarkService.getCategory(category.id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message.startsWith("No Category with this id"), "Incorrect Response Message");
    }
  });

  test("create multiple categories", async () => {
  });

  test("remove non-existant category", async () => {
  });

  });