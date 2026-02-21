import { v4 } from "uuid";

let placemarks = [];

export const placemarkMemStore = {
  async getAllPlacemarks() {
    return placemarks;
  },

    async addPlacemark(categoryId, placemark) {
    placemark._id = v4();
    placemark.categoryid = categoryId;
    placemarks.push(placemark);
    return placemark;
  },

  async getPlacemarkByCategoryId(id) {
    return placemarks.filter((placemark) => placemark.categoryid === id);
  },
};