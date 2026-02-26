import { Placemark } from "./placemark.js";

export const placemarkMongoStore = {
  async getPlacemarksByCategoryId(id) {
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
  },
};
