export const dashboardController = {
  index: {
    handler: async function (request, h) {
      // get pois
      const viewData = {
        title: "POI Dashboard",
        poi: pois,
      };
      return h.view("dashboard-view", viewData);
    },

  },
};
