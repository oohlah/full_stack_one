// eslint-disable-next-line import/no-extraneous-dependencies
import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { maggie, river, testCategories } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

EventEmitter.setMaxListeners(25);

suite("Category Model tests", () => {
 
  setup(async () => {
    db.init("firebase");
     await db.userStore.deleteAll();
     await db.categoryStore.deleteAllCategories();
    for (let i = 0; i < testCategories.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testCategories[i] = await db.categoryStore.addCategory(testCategories[i]);
    }
  });

  test("create a category", async () => {
  const newCategory = await db.categoryStore.addCategory(river);
  assertSubset(river, newCategory);
  });

  test("get a category by Id - success", async () => {
  await db.categoryStore.addCategory(river);  
  const returnedCategory = await db.categoryStore.getCategoryById(river._id);
  assertSubset(river, returnedCategory);
  });


   test("delete all categories", async () => {
   await db.categoryStore.deleteAllCategories();
   const returnedCategories = await db.categoryStore.getAllCategories();
   assert.equal(returnedCategories.length, 0);
  });

  test("get a category by Id - failure", async () => {
  assert.isNull(await db.categoryStore.getCategoryById(""));
  assert.isNull(await db.categoryStore.getCategoryById("123"));
  
  });

  test("delete category by Id - success", async () => {
  const category = await db.categoryStore.addCategory(river);  
  await db.categoryStore.deleteCategoryById(category._id);
  const deletedCategory = await db.categoryStore.getCategoryById(category._id);
  assert.isNull(deletedCategory);
  });


  });