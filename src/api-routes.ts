import { userApi } from "./api/user-api.js";
import { categoryApi } from "./api/category-api.js";
import { placemarkApi } from "./api/placemark-api.js";

export const apiRoutes = [
  { method: "GET" as const, path: "/api/users", config: userApi.find },
  { method: "GET" as const, path: "/api/users/{id}", config: userApi.findOne },
  { method: "POST" as const, path: "/api/users", config: userApi.create },
  { method: "PATCH" as const, path: "/api/users/{id}/name", config: userApi.updateUserName },
  { method: "PATCH" as const, path: "/api/users/{id}/email", config: userApi.updateUserEmail },
  { method: "PATCH" as const, path: "/api/users/{id}/password", config: userApi.updatePassword },
  { method: "DELETE" as const, path: "/api/users", config: userApi.deleteAll },

  { method: "GET" as const, path: "/api/categories", config: categoryApi.find },
  { method: "GET" as const, path: "/api/categories/{id}", config: categoryApi.findOne },
  { method: "POST" as const, path: "/api/categories", config: categoryApi.create },
  { method: "DELETE" as const, path: "/api/categories/{id}", config: categoryApi.deleteOne },
  { method: "DELETE" as const, path: "/api/categories", config: categoryApi.deleteAll },


  { method: "GET" as const, path: "/api/placemarks", config: placemarkApi.find },
  { method: "GET" as const, path: "/api/placemarks/{id}", config: placemarkApi.findOne },
  { method: "POST" as const, path: "/api/categories/{id}/placemarks", config: placemarkApi.create },
  { method: "PATCH" as const, path: "/api/placemarks/{id}/updateplacemark", config: placemarkApi.updatePlacemark},
  { method: "DELETE" as const, path: "/api/placemarks", config: placemarkApi.deleteAll },
  { method: "DELETE" as const, path: "/api/placemarks/{id}", config: placemarkApi.deleteOne },

  { method: "POST" as const, path: "/api/users/authenticate", config: userApi.authenticate },

 ];