import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { geoUtils } from "../utils/geo_utils.js";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";
import { PlacemarkCreate, Category} from "../types/object-types.js";

export const categoryController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const viewData = {
        title: "Category",
        category: category,
      };
      return h.view("category-view", viewData);
    },
  },

  addPlacemark: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      
      const payload = request.payload as {
        name: string;
        category: string;
        description: string;
        location: number;
        
      };
      const placemarkName = payload.name;
      // should also get country or city code and add as param
      const coords: { lat: number; lon: number } | null = await geoUtils.getPlacemarkCoordinates(placemarkName);
      // console.log("LAT: ", coords.lat, "LON:", coords.lon);
      
      if (!coords) {
       throw new Error("Could not get coordinates");
         }
     

      const weather = await geoUtils.getWeatherFromCoordinates(coords);
      
      if (!weather) {
      throw new Error("Weather data unavailable");
      }
      
      const newPlacemark: PlacemarkCreate = {
        name: payload.name,
        category: category.title,
        description: payload.description,
        location: coords,
        temp: weather.temperature,
        wind: weather.windSpeed,
      };
      console.log(newPlacemark);
      
      await db.placemarkStore.addPlacemark(category._id, newPlacemark);
      const placemarks = await db.placemarkStore.getPlacemarksByCategoryId(category._id); 
      console.log("CATEGORY PLACEMARKS:", placemarks);
      return h.redirect(`/category/${category._id}`);
    },
  },

  deletePlacemark: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.placemarkStore.deletePlacemark(request.params.placemarkid);
      return h.redirect(`/category/${category._id}`);
     
    },
  },
  uploadImage: {
    handler: async function (request: Request, h: ResponseToolkit) {
     

      try {

        const payload = request.payload as {
        imagefile: string;
      };

        const category: Category = await db.categoryStore.getCategoryById(request.params.id);
        console.log("CATEGORY: ", category);
        
         if (!category) {
        return h.redirect(`/`);
      }
        const file = payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(payload.imagefile);
          category.img = url;
          await db.categoryStore.updateCategory(category);
        }
        return h.redirect(`/category/${category._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/`);
        
      }
    },
    payload: {
      multipart: true,
      output: "data",
      maxBytes: 209715200,
      parse: true,
    },
  },
  deleteImage: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const file = category.img; // file is img associated with category
      if (Object.keys(file).length > 0) {
          await imageStore.deleteImage(file); // delete file from cloudinary
          category.img = null; // category img is null
          await db.categoryStore.updateCategory(category); // updateCategory
        }
      return h.redirect(`/category/${category._id}`); // redirect to empty view 
    },
    
  },
};
