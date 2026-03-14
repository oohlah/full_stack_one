import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schema.js"

export const settingsController = {
  index: {
    handler: async function (request, h) {
      const user = request.auth.credentials;
      // const user = await db.userStore.getUserById(loggedInUser._id);
       const viewData = {
         title: "Settings View",
         user: user,
       };
      return h.view("settings-view", viewData);
    },

  },
  updateName: {
    handler: async function (request, h){

    console.log("Hits updateName Controller");

    const user = request.auth.credentials;
   console.log(user);
    
    console.log("USER TO CHANGE",user);

    const newFirstName = request.payload.firstName;
    const newLastName = request.payload.lastName;

    const updatedUser = await db.userStore.updateUserName(user._id, {
        firstName: newFirstName,
        lastName: newLastName,
        });

    console.log("UPDATED USER: ", updatedUser);

    const viewData = {
      title: "User Settings",
      user: updatedUser,
    };
    
    console.log(`First Name Changed to ${updatedUser.firstName}`);
    console.log(`Last Name Changed to ${updatedUser.lastName}`);
    return h.view("settings-view", viewData);
  },
  },

    updateEmail: {
    handler: async function (request, h){

    console.log("Hits updateEmail Controller");

    const user = request.auth.credentials;
    
    console.log("USER TO CHANGE",user);

  
    // Returns the whole user object
    const updatedUser = await db.userStore.updateUserEmail(user._id, {
  email: request.payload.email
});

    console.log("UPDATED USER: ", updatedUser);

    const viewData = {
      title: "User Settings",
      user: updatedUser,
    };
    
    console.log(`Email Changed to: ${updatedUser.email}`);
    
    return h.view("settings-view", viewData);
  },
  },


};
