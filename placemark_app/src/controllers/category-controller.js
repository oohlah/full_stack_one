import { db } from "../models/db.js";

export const categoryController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const viewData = {
        title: "categories",
        category: category,
      };
      return h.view("category-view", viewData);
    },
  },

  addPOI: {
    handler: async function (request, h) {
      // get category by id
      const newPOI = {
        name: request.payload.name,
        // image
        // weather
        // location
      };
      // add poi to db
      return h.redirect(`/category/${category._id}`);
    },
  },

  deletePOI: {
    handler: async function (request, h) {
      // get category by id
      // delete POI with id
    //   return h.redirect(`/category/${poi._id}`);
    },
  },
};
