import { db } from "../models/db.js";
import { CategorySpec } from "../models/joi-schema.js"

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const categories = await db.categoryStore.getUserCategories(loggedInUser._id);
      const viewData = {
        title: "POI Dashboard",
        categories: categories,
      };
      return h.view("dashboard-view", viewData);
    },

  },
  addCategory: {
    validate: {
          payload: CategorySpec,
          options: {abortEarly: false},
          failAction: function (request, h, error) {
            return h.view("dashboard-view", { title: "Category title error", errors: error.details }).takeover().code(400);
          },
        },
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const newCategory = {
        userid: loggedInUser._id,
        title: request.payload.title,
      };
      await db.categoryStore.addCategory(newCategory);
      return h.redirect("/dashboard");
    
  },
  },
  deleteCategory: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.categoryStore.deleteCategoryById(category._id);
      return h.redirect("/dashboard");
    },
  },
};
