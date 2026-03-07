import { db } from "../models/db.js";
import { imageStore } from "../models/image-store.js";
import { geoUtils } from "../utils/geoapify_utils.js";

export const categoryController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const viewData = {
        title: "Category",
        category: category,
      };
      return h.view("category-view", viewData);
    },
  },

  addPlacemark: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);

      const placemarkName = request.payload.name;
      // should also get country or city code and add as param
      const coords = await geoUtils.getPlacemarkCoordinates(placemarkName);
      console.log(result);

      const newPlacemark = {
        name: request.payload.name,
        category: category.title,
        description: request.payload.description,
        location: coords,
        // image
        // weather
      };
      console.log(newPlacemark);
      await db.placemarkStore.addPlacemark(category._id, newPlacemark);
      return h.redirect(`/category/${category._id}`);
    },
  },

  deletePlacemark: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.placemarkStore.deletePlacemark(request.params.placemarkid);
      return h.redirect(`/category/${category._id}`);
     
    },
  },
  uploadImage: {
    handler: async function (request, h) {
      try {
        const category = await db.categoryStore.getCategoryById(request.params.id);
        console.log("CATEGORY: ", category);
        const file = request.payload.imagefile;
        if (Object.keys(file).length > 0) {
          const url = await imageStore.uploadImage(request.payload.imagefile);
          category.img = url;
          await db.categoryStore.updateCategory(category);
        }
        return h.redirect(`/category/${category._id}`);
      } catch (err) {
        console.log(err);
        return h.redirect(`/category/${category._id}`);
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
    handler: async function (request, h) {
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
