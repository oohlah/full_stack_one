import Boom from "@hapi/boom";
import { db } from "../models/db.js";
import { IdSpec, PlacemarkSpecCreate, PlacemarkSpec, PlacemarkSpecPlus, PlacemarkArraySpec, PlacemarkSpecUpdate} from "../models/joi-schema.js";
import { validationError } from "./logger.js";
import { Request, ResponseToolkit } from "@hapi/hapi";
import { Placemark } from "../types/object-types.js";
import { Err } from "joi";
import { geoUtils } from "../utils/geo_utils.js"; 

export const placemarkApi = {
  find: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit): Promise<Placemark[] | Boom.Boom> {
        try {

        const placemarks = await db.placemarkStore.getAllPlacemarks();
        if (!placemarks){
          return [];
        }else{
        return placemarks;
        }
      } catch (err: any) {
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
    async handler(request: Request, h: ResponseToolkit) {
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
    handler: async function (request: Request, h: ResponseToolkit) {
         try {

              ///////ADDDED TO ALLOW GEOUTILS TO WORK IN FRONTEND

              
     const category = await db.categoryStore.getCategoryById(request.params.id);

      // const categoryId = request.params.id;
      const payload = request.payload as any;

    
      const coords = await geoUtils.getPlacemarkCoordinates(payload.name);

      if (!coords) {
        return Boom.badRequest("Could not resolve location");
      }

      
      const weather = await geoUtils.getWeatherFromCoordinates(coords);

      // Final Object
      const newPlacemark = {
        name: payload.name,
        category: category.title,
        // categoryid: categoryId,
        description: payload.description,
        location: coords,
        temp: weather?.temperature ?? null,
        wind: weather?.windSpeed ?? null,
        created: Date.now()
      };

//////^^^^^ADDED TO ALLOW GEOUTILS TO WORK IN FRONTEND
       

        const created = await db.placemarkStore.addPlacemark(category._id, newPlacemark);
      
          return h.response(created).code(201);
    
      } catch (err) {
        return Boom.serverUnavailable("Database Error:", err);
      }
    },
     tags: ["api"],
     description: "Create a placemarkApi",
     notes: "Creates a placemark",
     // validates a payload object with no additional properties, and an id paramater
     validate: { payload: PlacemarkSpecCreate, params: { id: IdSpec }, failAction: validationError},
      //  params: { id: IdSpec }, failAction: validationError // adding id param, becase Swagger doesn't work without it
    
     // returns an object with additional properties
     response: { schema: PlacemarkSpecPlus, failAction: validationError },
  },

   updatePlacemark: {
         auth: { strategy: "jwt" },
         handler: async function(request: Request, h: ResponseToolkit): Promise<Placemark | Boom.Boom> {
         const {id} = request.params;
         const newPlacemark = request.payload; // name and description
          console.log("Updating placemark:", id, newPlacemark);
         try {
           const updatedPlacemark = await db.placemarkStore.updatePlacemark(id, newPlacemark);
           console.log("UPDATED Placemark:", updatedPlacemark);
           if (!updatedPlacemark) return Boom.notFound("Placemark not found");
            return updatedPlacemark;
            } catch (err) {
              console.error("API updatePlacemark error:", err);
             return Boom.serverUnavailable("Database error");
           }
         },
          tags: ["api"],
         description: "Update a placemark",
         notes: "Updates a Placemark",
         validate: { 
         params: { id: IdSpec },
         // payload is just the first and last name
         payload: PlacemarkSpecUpdate, failAction: validationError }, // allow partial updates
        // respose is the full user spec
        response: { schema: PlacemarkSpecPlus, failAction: validationError },
        },
  

  deleteAll: {
    auth: {
      strategy: "jwt",
    },
    handler: async function (request: Request, h: ResponseToolkit) {
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
    handler: async function (request: Request, h: ResponseToolkit) {
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
