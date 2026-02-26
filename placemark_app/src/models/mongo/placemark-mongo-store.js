import { Placemark } from "./track.js";

export const placemarkMongoStore = {
  async getPlacemarksByCateogryId(id) {
    const placemarks = await Placemark.find({ categoryid: id }).lean();
    return placemarks;
  },
};
