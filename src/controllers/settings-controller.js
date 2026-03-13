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

    const updatedUser = await db.userStore.updateUser(user._id, {
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
//   addCategory: {
//     validate: {
//           payload: CategorySpec,
//           options: {abortEarly: false},
//           failAction: function (request, h, error) {
//             return h.view("dashboard-view", { title: "Category title error", errors: error.details }).takeover().code(400);
//           },
//         },
//     handler: async function (request, h) {
//       const loggedInUser = request.auth.credentials;
//       const newCategory = {
//         userid: loggedInUser._id,
//         title: request.payload.title,
//       };
//       await db.categoryStore.addCategory(newCategory);
//       return h.redirect("/dashboard");
    
//   },
//   },
//   deleteCategory: {
//     handler: async function (request, h) {
//       const category = await db.categoryStore.getCategoryById(request.params.id);
//       await db.categoryStore.deleteCategoryById(category._id);
//       return h.redirect("/dashboard");
//     },
//   },
};
