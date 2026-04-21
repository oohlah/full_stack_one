import { dashboardController } from "./controllers/dashboard-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { placemarkController } from "./controllers/placemark-controller.js";
import { settingsController } from "./controllers/settings-controller.js";

export const webRoutes = [
  
  { method: "GET" as const, path: "/", config: accountsController.index },
  { method: "GET" as const, path: "/signup", config: accountsController.showSignup },
  { method: "GET" as const, path: "/login", config: accountsController.showLogin },
  { method: "GET" as const, path: "/logout", config: accountsController.logout },
  { method: "POST" as const, path: "/register", config: accountsController.signup },
  { method: "POST" as const, path: "/authenticate", config: accountsController.login },

  { method: "GET" as const, path: "/dashboard/admin", config: { auth: { strategy: "session", scope: "admin" }, handler: dashboardController.adminIndex.handler } },
  { method: "POST" as const, path: "/dashboard/makeadmin/{id}", config: { auth: { strategy: "session", scope: "admin" }, handler: dashboardController.makeAdmin.handler } },
  { method: "GET" as const, path: "/dashboard/deleteuser/{id}", config: { auth: { strategy: "session", scope: "admin" }, handler: dashboardController.deleteUser.handler } },


  { method: "GET" as const, path: "/dashboard", config: dashboardController.index },
  { method: "POST" as const, path: "/dashboard/addcategory", config: dashboardController.addCategory},
  { method: "GET" as const, path: "/dashboard/deletecategory/{id}", config: dashboardController.deleteCategory },

   { method: "GET" as const, path: "/category/{id}", config: categoryController.index},
   { method: "POST" as const, path: "/category/{id}/addplacemark", config: categoryController.addPlacemark },
   { method: "GET" as const, path: "/category/{id}/deleteplacemark/{placemarkid}", config: categoryController.deletePlacemark},

   { method: "POST" as const, path: "/category/{id}/uploadimage", config: categoryController.uploadImage },
   { method: "GET" as const, path: "/category/{id}/deleteImage", config: categoryController.deleteImage},

  { method: "GET" as const, path: "/placemark/{id}/editplacemark/{placemarkid}", config: placemarkController.index },
  { method: "POST" as const, path: "/placemark/{id}/updateplacemark/{placemarkid}", config: placemarkController.updatePlacemark },

  { method: "GET" as const, path: "/settings", config: settingsController.index },
  { method: "POST" as const, path: "/settings/updatename", config: settingsController.updateName },
  { method: "POST" as const, path: "/settings/updateemail", config: settingsController.updateEmail },
  { method: "POST" as const, path: "/settings/updatepassword", config: settingsController.updatePassword },
   { method: "GET" as const, path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false as const} },




];
