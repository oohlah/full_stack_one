import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
import { db } from "../../src/models/db.js";

suite("User API tests", () => {
  setup(async () => {
     db.init();
   await placemarkService.deleteAllUsers();
       for (let i = 0; i < testUsers.length; i += 1) {
         // eslint-disable-next-line no-await-in-loop
         testUsers[i] = await placemarkService.createUser(testUsers[i]);
       }
  });
  teardown(async () => {
  });

  test("create a user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id);
  });

    test("get a user - bad id", async () => {
    try {
      const returnedUser = await placemarkService.getUser("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
      test("get a user", async () => {
    const returnedUser = await placemarkService.getUser(testUsers[0]._id);
    assertSubset(testUsers[0], returnedUser);
    
  });

    test("get a user - deleted user", async () => {
    await placemarkService.deleteAllUsers();
    try {
      const returnedUser = await placemarkService.getUser(testUsers[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

   test("delete all userApi", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await placemarkService.deleteAllUsers();
    returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 0);
  });
});