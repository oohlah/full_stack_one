import { dashboardController } from "./controllers/dashboard-controller.js";
import { accountsController } from "./controllers/accounts-controller.js";
import { categoryController } from "./controllers/category-controller.js";
import { placemarkController } from "./controllers/placemark-controller.js";
import { settingsController } from "./controllers/settings-controller.js";

export const webRoutes = [
  
  { method: "GET", path: "/", config: accountsController.index },
  { method: "GET", path: "/signup", config: accountsController.showSignup },
  { method: "GET", path: "/login", config: accountsController.showLogin },
  { method: "GET", path: "/logout", config: accountsController.logout },
  { method: "POST", path: "/register", config: accountsController.signup },
  { method: "POST", path: "/authenticate", config: accountsController.login },

  { method: "GET", path: "/dashboard", config: dashboardController.index },
  { method: "POST", path: "/dashboard/addcategory", config: dashboardController.addCategory},
  { method: "GET", path: "/dashboard/deletecategory/{id}", config: dashboardController.deleteCategory },

   { method: "GET", path: "/category/{id}", config: categoryController.index},
   { method: "POST", path: "/category/{id}/addplacemark", config: categoryController.addPlacemark },
   { method: "GET", path: "/category/{id}/deleteplacemark/{placemarkid}", config: categoryController.deletePlacemark},

   { method: "POST", path: "/category/{id}/uploadimage", config: categoryController.uploadImage },
   { method: "GET", path: "/category/{id}/deleteImage", config: categoryController.deleteImage},

  { method: "GET", path: "/placemark/{id}/editplacemark/{placemarkid}", config: placemarkController.index },
  { method: "POST", path: "/placemark/{id}/updateplacemark/{placemarkid}", config: placemarkController.updatePlacemark },

  { method: "GET", path: "/settings", config: settingsController.index },
  { method: "POST", path: "/settings/updatename", config: settingsController.updateName },
  { method: "POST", path: "/settings/updateemail", config: settingsController.updateEmail },
  { method: "POST", path: "/settings/updatepassword", config: settingsController.updatePassword },
   { method: "GET", path: "/{param*}", handler: { directory: { path: "./public" } }, options: { auth: false } },




];
