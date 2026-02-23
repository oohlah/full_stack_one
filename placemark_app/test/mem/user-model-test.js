  
// eslint-disable-next-line import/no-extraneous-dependencies
import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { maggie, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";

suite("User Model tests", () => {
  
  setup(async () => {
    db.init();
     await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser)
  });

    test("delete all userApi", async () => {
    let returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    let returnedUsers2 = await db.userStore.getAllUsers();
    assert.equal(returnedUsers2.length, 0);
   
  });

  test("get a user - success", async () => {
   let returnedUser = await db.userStore.addUser(maggie);
   let userEmail = await db.userStore.getUserByEmail(maggie.email);
   assert.equal(userEmail.email, maggie.email);
   let userId = await db.userStore.getUserById(maggie._id);
   assert.equal(userId._id, maggie._id);
  });

  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    assert.isNull(deletedUser);

  });

  test("get a user - bad params", async () => {
   assert.isNull (await db.userStore.getUserById("123"));
   assert.isNull(await db.userStore.getUserByEmail("123"));
  });

  test("delete One User - fail", async () => {
  let returnedUsers = await db.userStore.getAllUsers();
   console.log(returnedUsers);
   let deleteUser = await db.userStore.deleteUserById("");
   assert.equal(returnedUsers.length, 3);
  });
});


