import Mongoose from "mongoose";
import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
    async getAllPlacemarks() {
    const placemarks = await Placemark.find().lean();
    return placemarks;
  },

   async addPlacemark(categoryId, placemark) {
    placemark.categoryid = categoryId;
    const newPlacemark = new Placemark(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id);
  

  },

    async getPlacemarkById(id){
    if (Mongoose.isValidObjectId(id)) {
    const placemark = await Placemark.findOne({ _id: id }).lean();
    return placemark;
  }
    return null;
  },

  async getPlacemarksByCategoryId(id) {
    if (Mongoose.isValidObjectId(id)) {
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
    }return [];
  },

    async deletePlacemark(id) { 
    try {
      await Placemark.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

   async deleteAllPlacemarks() {
    await Placemark.deleteMany({});
  },

    async updatePlacemark(placemark, updatedPlacemark) {
    const placemarkDoc = await Placemark.findOne({ _id: placemark._id });
    placemarkDoc.name = updatedPlacemark.name;
    placemarkDoc.description = updatedPlacemark.description;
    await placemarkDoc.save();
  },
};
