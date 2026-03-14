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

  async getPlacemarksByCategoryId(id) {
    return placemarks.filter((placemark) => placemark.categoryid === id);
  },

  async getPlacemarkById(id){
    let p = placemarks.find((placemark) => placemark._id === id);
    if (p === undefined) {p = null};
    return p;
  },

   async updatePlacemark(placemark, updatedPlacemark) {
    placemark.name = updatedPlacemark.name;
    placemark.category = updatedPlacemark.category;
    placemark.description = updatedPlacemark.description;
  },

   async deletePlacemark(id) { 
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) placemarks.splice(index, 1);
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  }
};