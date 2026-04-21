
import { db } from "../models/db.js";
import { CategorySpec } from "../models/joi-schema.js"
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";


export const dashboardController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const loggedInUser = request.auth.credentials as {
      _id: string;
      scope?: "user" | "admin";
    };

       console.log("Logged in user credentials:", request.auth.credentials);

      const categories = await db.categoryStore.getUserCategories(loggedInUser._id);

       // if user is admin - redirect admin dashboard
      if (loggedInUser.scope === "admin") {
      return h.redirect("/dashboard/admin");
    }

      const viewData = {
        title: "POI Dashboard",
        categories: categories,
      };
      return h.view("dashboard-view", viewData);
    },
 },
    adminIndex: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const loggedInUser = request.auth.credentials as {
      _id: string;
      scope?: "user" | "admin";
    };

      console.log("Logged:", request.auth.credentials);

      console.log("ADMIN DASHBOARD");
      // restrict acces if not admin
      if (loggedInUser.scope !== "admin") {
        return h.response("Forbidden").code(403);
      }

      const users = await db.userStore.getAllUsers();
      const categories = await db.categoryStore.getAllCategories();
      const viewData = {
        title: "Admin Dashboard",
        users,
        categories,
      };
      return h.view("admin-dashboard-view", viewData);
    },
    
  },

  makeAdmin: {
  handler: async function (request: Request, h: ResponseToolkit) {
    const userId = request.params.id;

    await db.userStore.setAdmin(userId);
    

    return h.redirect("/dashboard/admin");
  },
},

 deleteUser: {
  handler: async function (request: Request, h: ResponseToolkit) {
    const userId = request.params.id;

    await db.userStore.deleteUserById(userId);

    return h.redirect("/dashboard/admin");
  },
},
  addCategory: {
    validate: {
          payload: CategorySpec,
          options: {abortEarly: false},
          failAction: function (request: Request, h: ResponseToolkit, error: any) {
            return h.view("dashboard-view", { title: "Category title error", errors: error.details }).takeover().code(400);
          },
        },
    handler: async function (request: Request, h: ResponseToolkit) {

      const payload = request.payload as {
        title: string;
        
      };

      const loggedInUser = request.auth.credentials;
      const newCategory = {
        userid: loggedInUser._id,
        title: payload.title,
      };
      await db.categoryStore.addCategory(newCategory);
      return h.redirect("/dashboard");
    
  },
  },
  deleteCategory: {
    handler: async function (request: Request, h: ResponseToolkit) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      await db.categoryStore.deleteCategoryById(category._id);
      return h.redirect("/dashboard");
    },
  },
};
