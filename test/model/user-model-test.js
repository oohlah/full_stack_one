  
// eslint-disable-next-line import/no-extraneous-dependencies
import { assert } from "chai";
import { EventEmitter } from "events";
import { db } from "../../src/models/db.js";
import { maggie, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";


EventEmitter.setMaxListeners(25);

suite("User Model tests", () => {
  
  setup(async () => {
    db.init("json");
     await db.userStore.deleteAll();
    for (let i = 0; i < testUsers.length; i += 1) {
      // eslint-disable-next-line no-await-in-loop
      testUsers[i] = await db.userStore.addUser(testUsers[i]);
    }
  });

  test("create a user", async () => {
    const newUser = await db.userStore.addUser(maggie);
    assertSubset(maggie, newUser);
    
  });


    test("delete all userApi", async () => {
    const returnedUsers = await db.userStore.getAllUsers();
    assert.strictEqual(returnedUsers.length, 3);
    await db.userStore.deleteAll();
    const returnedUsers2 = await db.userStore.getAllUsers();
    assert.strictEqual(returnedUsers2.length, 0);
   
  });

  test("get a user - success", async () => {
    const user = await db.userStore.addUser(maggie);
    const returnedUser1 = await db.userStore.getUserById(user._id);
    assertSubset(returnedUser1, user);
    const returnedUser2 = await db.userStore.getUserByEmail(user.email);
    assertSubset(returnedUser2, user);
  });

  test("delete One User - success", async () => {
    await db.userStore.deleteUserById(testUsers[0]._id);
    const returnedUsers = await db.userStore.getAllUsers();
    assert.equal(returnedUsers.length, testUsers.length - 1);
    const deletedUser = await db.userStore.getUserById(testUsers[0]._id);
    console.log("Deleting user with id:", testUsers[0]._id);
    assert.isNull(deletedUser);

  });

  test("get a user - bad params (fail)", async () => {
   assert.isNull (await db.userStore.getUserById("123"));
   assert.isNull(await db.userStore.getUserByEmail("123"));
  });

  test("delete One User - fail", async () => {
   await db.userStore.deleteUserById("");
   const returnedUsers = await db.userStore.getAllUsers();
   assert.equal(returnedUsers.length, 3);
  });
  test("update a user's first and last name - success", async () => {
  
  const user = testUsers[0];
 
  // firstName and lastName to be updated to..
  const updates = {
    firstName: "newFirstName",
    lastName: "newLastName"
  };

  await db.userStore.updateUserName(user._id, updates);

  // get the updated user
   const updatedUser = await db.userStore.getUserById(user._id);

  // updated entered should match first and last name of returned user
  assert.strictEqual(updatedUser.firstName, updates.firstName);
  assert.strictEqual(updatedUser.lastName, updates.lastName);
});

test("update a user's email - success", async () => {
  
  const user = testUsers[0];
 
  // firstName and lastName to be updated to..
  const updates = {
    email: "new@email.com"
  };

  await db.userStore.updateUserEmail(user._id, updates);

  // get the updated user
   const updatedUser = await db.userStore.getUserById(user._id);

  assert.strictEqual(updatedUser.email, updates.email);
  
});

test("test password match and update - success", async () => {

  const user = testUsers[0];
  const currentPassword = user.password;
  const match = await db.userStore.checkCurrentPassword(currentPassword,user);
  assert.isTrue(match);

   const newPassword = { password: "newPassword"};
   await db.userStore.updatePassword(newPassword, user);

  // get the updated user
   const updatedUser = await db.userStore.getUserById(user._id);

  assert.strictEqual(updatedUser.password, updatedUser.password);

});


});