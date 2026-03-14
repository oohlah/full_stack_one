// eslint-disable-next-line import/no-extraneous-dependencies
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { UserArray, IdSpec, UserSpecPlus, UserSpec, UserSpecName, UserSpecEmail, 
  UserSpecPassword, UserCredentialsSpec, JwtAuth } from "../models/joi-schema.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

export const userApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const users = await db.userStore.getAllUsers();
        return users;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
    description: "Get all userApi",
    notes: "Returns details of all userApi",
    // return array
    response: { schema: UserArray, failAction: validationError},
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserById(request.params.id);
        if (!user) {
          return Boom.notFound("No User with this id");
        }
        return user;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
     tags: ["api"],
     description: "Get userApi with id",
     notes: "Returns user details",
     // validate incoming id
     validate: { params: { id: IdSpec }, failAction: validationError },
     // return one
     response: { schema: UserSpecPlus, failAction: validationError},
  },

  create: {
    auth: false, // false so creation of user before authentication
    handler: async function (request, h) {
      try {
        const user = await db.userStore.addUser(request.payload);
        if (user) {
          return h.response(user).code(201);
        }
        return Boom.badImplementation("error creating user");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
     tags: ["api"],
     description: "Create a user",
     notes: "Creates a user",
     // excpect incoming data not to contain id etc.
     validate: { payload: UserSpec, failAction: validationError},
     // excpect response to include additional properties
     response: { schema: UserSpecPlus, failAction: validationError },
  },
    updateUserName: {
       auth: { strategy: "jwt" },
       handler: async function(request, h) {
       const { id } = request.params;
       const name = request.payload; // patial update - can be any field for api
       try {
         const updatedUser = await db.userStore.updateUserName(id, name);
         console.log("UPDATED USER:", updatedUser);
         if (!updatedUser) return Boom.notFound("User not found");
          return updatedUser;
          } catch (err) {
           return Boom.serverUnavailable("Database error");
         }
       },
        tags: ["api"],
       description: "Update user email",
       notes: "Update first and last name of user",
       validate: { 
       params: { id: IdSpec },
       // payload is just the first and last name
       payload: UserSpecName, failAction: validationError }, // allow partial updates
      // respose is the full user spec
      response: { schema: UserSpecPlus, failAction: validationError },
      },

       updateUserEmail: {
       auth: { strategy: "jwt" },
       handler: async function(request, h) {
       const { id } = request.params;
       const email = request.payload; // patial update - can be any field for api
       try {
         const updatedUser = await db.userStore.updateUserEmail(id, email);
         if (!updatedUser) return Boom.notFound("User not found");
          return updatedUser;
          } catch (err) {
           return Boom.serverUnavailable("Database error");
         }
       },
        tags: ["api"],
       description: "Update user email",
       notes: "Update email field of user",
       validate: { 
       params: { id: IdSpec },
       // payload is just the first and last name
       payload: UserSpecEmail, failAction: validationError }, // allow partial updates
      // respose is the full user spec
      response: { schema: UserSpecPlus, failAction: validationError },
      },

      //  updatePassword: {
      //  auth: { strategy: "jwt" },
      //  handler: async function(request, h) {
      //  const { id } = request.params;
      //  const password = request.payload; // patial update - can be any field for api
      //  try {
      //    const updatedUser = await db.userStore.updatePassword(password, id);
      //    if (!updatedUser) return Boom.notFound("User not found");
      //     return updatedUser;
      //     } catch (err) {
      //      return Boom.serverUnavailable("Database error");
      //    }
      //  },
      //   tags: ["api"],
      //  description: "Update user password",
      //  notes: "Update password field of user",
      //  validate: { 
      //  params: { id: IdSpec },
      //  // payload iis just the email 
      //  payload: UserSpecPassword, failAction: validationError }, // allow partial updates
      // // respose is the full user spec
      // response: { schema: UserSpecPlus, failAction: validationError },
      // },
   updatePassword: {
  auth: { strategy: "jwt" },
  handler: async function(request, h) {
    const { id } = request.params;
    const { currentPassword, password } = request.payload;

    try {
      const user = await db.userStore.getUserById(id);
      if (!user) return Boom.notFound("User not found");

      // check current password
      if (user.password !== currentPassword) {
        return Boom.unauthorized("Current password is incorrect");
      }

      // update password
      const updatedUser = await db.userStore.updatePassword(password, id);
      return updatedUser;

    } catch (err) {
      return Boom.serverUnavailable("Database error");
    }
  },
  tags: ["api"],
  description: "Change user password",
  notes: "Checks current password and updates to new password if valid",
  validate: {
    params: { id: IdSpec },
    payload: UserSpecPassword, // should include { currentPassword, newPassword }
    failAction: validationError
  },
  response: { schema: UserSpecPlus, failAction: validationError },
},

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.userStore.deleteAll();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
     tags: ["api"],
     description: "Delete all users",
     notes: "Deletes all users",
     // nothing being validated, nothing being returned
  },

   authenticate: {
    auth: false, // false so authentication can happen 
    handler: async function (request, h) {
      try {
        const user = await db.userStore.getUserByEmail(request.payload.email);
        if (!user) {
          return Boom.unauthorized("User not found");
        }
        if (user.password !== request.payload.password) {
          return Boom.unauthorized("Invalid password");
        }
        const token = createToken(user);
        return h.response({ success: true, token: token }).code(201);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
     tags: ["api"],
    description: "Authenticate  a User",
    notes: "If user has valid email/password, create and return a JWT token",
    validate: { payload: UserCredentialsSpec, failAction: validationError },
    response: { schema: JwtAuth, failAction: validationError }
  },
   
};
