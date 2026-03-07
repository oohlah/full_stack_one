import { EventEmitter } from "events";
import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, river,testCategories, maggieCredentials } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

EventEmitter.setMaxListeners(25);

suite(" Category Api tests", () => {
    let user = null;
  setup(async () => {
    placemarkService.clearAuth();
    user = await placemarkService.createUser(maggie);
     await placemarkService.authenticate(maggieCredentials);
    await placemarkService.deleteAllCategories();
    await placemarkService.deleteAllUsers();
    user = await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    river.userid = user._id;
    
  });
  teardown(async () => {

  });
 
    test("create category", async () => {
    console.log("USER", user);
    console.log("Maggie", maggie);
    try{
    const returnedCategory = await placemarkService.createCategory(river);

    console.log("RIVER:", river);
    console.log("RETURNED CATEGORY:", returnedCategory)
    assert.isNotNull(returnedCategory);
    assertSubset(river, returnedCategory);
    }catch (error){
        console.log(error.message);
        throw error; 
    }
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
     for (let i = 0; i < testCategories.length; i += 1) {
      testCategories[i].userid = user._id;
      // eslint-disable-next-line no-await-in-loop
      await placemarkService.createCategory(testCategories[i]);
    }
    let returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, testCategories.length);
    await placemarkService.deleteAllCategories();
    returnedLists = await placemarkService.getAllCategories();
    assert.equal(returnedLists.length, 0);
  });

  test("remove non-existant category", async () => {
    try {
      const response = await placemarkService.deleteCategory("not an id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message.startsWith("No Category with this id"), "Incorrect Response Message");
    }
  });

  });