export const dashboardController = {
  index: {
    handler: async function (request, h) {
      // get pois
      const viewData = {
        title: "POI Dashboard",
        // categore: category,
      };
      return h.view("dashboard-view", viewData);
    },

  },
  addCategory: {
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
