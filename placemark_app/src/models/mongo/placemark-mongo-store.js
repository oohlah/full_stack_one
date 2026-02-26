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
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
  },

  async getPlacemarksByCategoryId(id) {
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
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
