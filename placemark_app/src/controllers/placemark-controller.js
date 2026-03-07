import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schema.js";

export const placemarkController = {
  index: {
    handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
      const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);

     
      const viewData = {
        title: "River",
        category: category,
        placemark: placemark,
      };
      
      return h.view("placemark-view", viewData);
    },
  },

   update: {
     validate: {
       payload: PlacemarkSpec,
       options: { abortEarly: false },
       failAction: function (request, h, error) {
         return h.view("placemark-view", { title: "Edit placemark error", errors: error.details }).takeover().code(400);
       },
     },
     handler: async function (request, h) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
       const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
       const newPlacemark = {
          name: request.payload.name,
          category: category.title,
          description: request.payload.description,
       };
       console.log(newPlacemark);
       await db.placemarkStore.updatePlacemark(placemark, newPlacemark);
       return h.redirect(`/category/${request.params.id}`);
     },
   },
};
