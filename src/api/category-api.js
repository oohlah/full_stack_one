// eslint-disable-next-line import/no-extraneous-dependencies
import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec,CategorySpec, CategorySpecPlus, CategoryArraySpec } from "../models/joi-schema.js";
import { validationError } from "./logger.js";

export const categoryApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const categories = await db.categoryStore.getAllCategories();
        return categories;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
     description: "Find all categoryApi",
     notes: "Return all categories",
     // doesn't validate anything, returns an array
     response: { schema: CategoryArraySpec, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        if (!category) {
          return Boom.notFound("No Category with this id");
        }
        return category;
      } catch (err) {
        return Boom.serverUnavailable("No Category with this id");
      }
    },
    tags: ["api"],
     description: "Get Category with id",
     notes: "Return a specific category",
     // validate a parameter - id
     validate: { params: { id: IdSpec }, failAction: validationError },
     // returns one category
     response: { schema: CategorySpecPlus, failAction: validationError},

  },
deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        if (!category) {
          return Boom.notFound("No Category with this id");
        }
        await db.categoryStore.deleteCategoryById(category._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Category with this id");
      }
    },
     tags: ["api"],
     description: "Delete one category by id",
     notes: "delete a specific category",
     // validate a parameter - id
     validate: { params: { id: IdSpec }, failAction: validationError },
      // doesn't return anything
  },

    create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        const loggedInUser = request.auth.credentials;

        const newCategory = {
          userid: loggedInUser._id,       
          title: request.payload.title,
          img: request.payload.img
        };

      const category = await db.categoryStore.addCategory(newCategory);

        if (category) {
          return h.response(category).code(201);
        }
        return Boom.badImplementation("error creating category");
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },

    tags: ["api"],
     description: "create a category",
     notes: "creates a category api",
     // validates a payload with no additional properties 
    validate: { payload: CategorySpec, failAction: validationError },
    // returns an item with additional properties,
    response: { schema: CategorySpecPlus, failAction: validationError },

  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
      try {
        await db.categoryStore.deleteAllCategories();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
    tags: ["api"],
     description: "Delete all categories",
     notes: "deletes all categories",
     // validates nothing, returns nothing
  },
};
