import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User API tests", () => {
  setup(async () => {
   await db.userStore.deleteAll();
       for (let i = 0; i < testUsers.length; i += 1) {
         // eslint-disable-next-line no-await-in-loop
         testUsers[i] = await db.userStore.addUser(testUsers[i]);
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
});