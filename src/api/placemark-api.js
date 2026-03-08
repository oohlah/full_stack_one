import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkSpec, PlacemarkSpecPlus, PlacemarkArraySpec} from "../models/joi-schema.js";
import { validationError } from "./logger.js";

export const placemarkApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
        try {
        const placemarks = await db.placemarkStore.getAllPlacemarks();
        return placemarks;
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
     tags: ["api"],
     description: "Find all placemarksApi",
     notes: "Return all placemarks",
     // no validation, returns an array - returning array without additional mongo properties
     response: { schema: PlacemarkArraySpec, failAction: validationError },
  },

  findOne: {
    auth: {
      strategy: "jwt",
    },
    async handler(request) {
         try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        if (!placemark) {
          return Boom.notFound("No placemark with this id");
        }
        return placemark;
      } catch (err) {
        return Boom.serverUnavailable("No placemark with this id");
      }
    },
     tags: ["api"],
     description: "Find one placemarkApi with id",
     notes: "Return a specific placemark",
     // validates a payload
     validate: { params: { id: IdSpec }, failAction: validationError },
     // returns one placemark
     response: { schema: PlacemarkSpecPlus, failAction: validationError},
  },

  create: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
         try {
        const placemark = await db.placemarkStore.addPlacemark(request.params.id, request.payload);
        if (placemark) {
          return h.response(placemark).code(201);
        }
        return Boom.badImplementation("error creating placemark");
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
     tags: ["api"],
     description: "Create a placemarkApi",
     notes: "Creates a placemark",
     // validates a payload object with no additional properties, and an id paramater
     validate: { payload: PlacemarkSpec, params: { id: IdSpec }, failAction: validationError},
      //  params: { id: IdSpec }, failAction: validationError // adding id param, becase Swagger doesn't work without it
    
     // returns an object with additional properties
     response: { schema: PlacemarkSpecPlus, failAction: validationError },
  },

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
        try {
        await db.placemarkStore.deleteAllPlacemarks();
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
     tags: ["api"],
     description: "Delete all placemarksApi",
     notes: "Delete all placemarks",
     // validates nothing, returns nothing
  },

  deleteOne: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request, h) {
        try {
        const placemark = await db.placemarkStore.getPlacemarkById(request.params.id);
        if (!placemark) {
          return Boom.notFound("No Placemark with this id");
        }
        await db.placemarkStore.deletePlacemark(placemark._id);
        return h.response().code(204);
      } catch (err) {
        return Boom.serverUnavailable("No Placemark with this id:", err);
      }
    },
     tags: ["api"],
     description: "Delete placemarkApi by id",
     notes: "Deletes a specific placemark",
     // validates a parameter, returns nothing
     validate: { params: { id: IdSpec }, failAction: validationError },
    },
};
