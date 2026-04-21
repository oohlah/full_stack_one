import { db } from "../models/db.js";
import { PlacemarkSpec } from "../models/joi-schema.js";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export const placemarkController = {
  index: {
    handler: async function (request: Request, h: ResponseToolkit) {
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

   updatePlacemark: {
     validate: {
       payload: PlacemarkSpec,
       options: { abortEarly: false },
       failAction: function (request: Request, h: ResponseToolkit, error: any) {
         return h.view("placemark-view", { title: "Edit placemark error", errors: error.details }).takeover().code(400);
       },
     },
     handler: async function (request: Request, h: ResponseToolkit) {
      const category = await db.categoryStore.getCategoryById(request.params.id);
       const placemark = await db.placemarkStore.getPlacemarkById(request.params.placemarkid);
       
       const payload = request.payload as {
        name: string;
        description: string;
        
      };

       const newPlacemark = {
          name: payload.name,
          category: category.title,
          description: payload.description,
       };
       console.log(newPlacemark);
       await db.placemarkStore.updatePlacemark(placemark._id, newPlacemark);
       return h.redirect(`/category/${request.params.id}`);
     },
   },
};
