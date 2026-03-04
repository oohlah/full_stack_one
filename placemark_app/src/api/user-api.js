// eslint-disable-next-line import/no-extraneous-dependencies
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { UserArray, IdSpec, UserSpecPlus, UserSpec } from "../models/joi-schema.js";
import { validationError } from "./logger.js";
import { createToken } from "./jwt-utils.js";

export const userApi = {
  find: {
    strategy: "jwt",
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
    strategy: "jwt",
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
     //return one
     response: { schema: UserSpecPlus, failAction: validationError},
  },

  create: {
    strategy: "jwt",
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

  deleteAll: {
    strategy: "jwt",
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
     //nothing being validated, nothing being returned
  },

   authenticate: {
    auth: false,
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
  },
};
