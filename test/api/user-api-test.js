import { assert } from "chai";
import { placemarkService } from "./placemark-service.js";
import { maggie, maggieCredentials, testUsers } from "../fixtures.js";
import { assertSubset } from "../test-utils.js";
// import { db } from "../../src/models/db.js";

const users = new Array(testUsers.length);

suite("User API tests", () => {
 
  setup(async () => {
    //  db.init();
      placemarkService.clearAuth();
      await placemarkService.createUser(maggie);
      await placemarkService.authenticate(maggieCredentials);
      await placemarkService.deleteAllUsers();
       for (let i = 0; i < testUsers.length; i += 1) {
         // eslint-disable-next-line no-await-in-loop
         users[i] = await placemarkService.createUser(testUsers[i]);
       }
         await placemarkService.createUser(maggie);
         await placemarkService.authenticate(maggieCredentials);
       
  });
  teardown(async () => {
  });

  test("create a user", async () => {
    const newUser = await placemarkService.createUser(maggie);
    assertSubset(maggie, newUser);
    assert.isDefined(newUser._id); // checks that id is not undefined
  });

    test("get a user", async () => {
    const returnedUser = await placemarkService.getUserById(users[0]._id);
    assertSubset(users[0], returnedUser);
   });

    test("get a user - bad id", async () => {
    try {
      const returnedUser = await placemarkService.getUserById("1234");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });
   
    test("get a user - deleted user", async () => {
     await placemarkService.deleteAllUsers();
     await placemarkService.createUser(maggie);
     await placemarkService.authenticate(maggieCredentials); // auth email and password only
    try {
        // users returned from database
      const returnedUser = await placemarkService.getUserById(users[0]._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No User with this id");
      assert.equal(error.response.data.statusCode, 404);
    }
  });

   test("delete all userApi", async () => {
    let returnedUsers = await placemarkService.getAllUsers();
    assert.equal(returnedUsers.length, 4);
    await placemarkService.deleteAllUsers();
    // create maggie and authenticate so that jwt is valid again
    await placemarkService.createUser(maggie);
    await placemarkService.authenticate(maggieCredentials);
    returnedUsers = await placemarkService.getAllUsers();
    // other 3 users are deleted - only one authenticated users left
    assert.equal(returnedUsers.length, 1);
  });

    test("update user first,last name and email - success", async () => {
   
      const user = await placemarkService.createUser(testUsers[0]);
      const updatedName = {
        firstName: "newFirstname",
        lastName: "newLastName" }
      // update user with updates
      const returnedUser = await placemarkService.updateUserName(user._id, updatedName);
      assert.strictEqual(updatedName.firstName, returnedUser.firstName);
      assert.strictEqual(updatedName.lastName, returnedUser.lastName);
    
  });

    test("update user email - success", async () => {
       const user = await placemarkService.createUser(testUsers[1]);
      const updatedEmail = { email: "new@email.com",} // user object with email property
      const returnedUser = await placemarkService.updateUserEmail(user._id, updatedEmail);
      assert.strictEqual(updatedEmail.email, returnedUser.email);
    })

    test("test password match and update - success", async () => {
    
      const user = await placemarkService.createUser(testUsers[1]);
      console.log("USER", user);
       const passwordData = {
         currentPassword: user.password,  
         password: "newPassword123"    // new password to update to
          };
     
      // check and update the password
       const data = await placemarkService.updatePassword(user._id, passwordData);
       console.log("RETURNED USER PASSWORD DATA:", data);
       const returnedUser = await placemarkService.getUserById(user._id);
       assert.strictEqual(returnedUser.password, passwordData.password);
});
    
  
});