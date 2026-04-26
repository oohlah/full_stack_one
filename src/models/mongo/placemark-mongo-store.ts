import Mongoose from "mongoose";
import { Placemark } from "../../types/object-types.js";
import { PlacemarkMongoose } from "./placemark.js";

export const placemarkMongoStore = {
    async getAllPlacemarks():Promise<Placemark[]> {
      const docs = await PlacemarkMongoose.find().lean();

       return docs.map((p) => ({
      _id: p._id.toString(),
      name: p.name,
      category: p.category,
      categoryid: p.categoryid.toString(),
      created: p.created,
      description: p.description,
      location: p.location,
      temp: p.temp,
      wind: p.wind,
    }));

  },

   async addPlacemark(categoryId: string, placemark: Placemark) {
    (placemark as any).categoryid = categoryId;
    const newPlacemark = new PlacemarkMongoose(placemark);
    const placemarkObj = await newPlacemark.save();
    return this.getPlacemarkById(placemarkObj._id.toString());
  

  },

    async getPlacemarkById(id: string):Promise<Placemark | null>{
    if (!Mongoose.isValidObjectId(id)) {
    return null;
  }

  const placemark = await PlacemarkMongoose.findById(id).lean();

  if (!placemark) {
    return null;
  }

  return {
    ...placemark,
    _id: placemark._id.toString(),
    categoryid: placemark.categoryid.toString(),
  } as Placemark;
  },

  async getPlacemarksByCategoryId(id: string) {
    if (Mongoose.isValidObjectId(id)) {
    const placemarks = await PlacemarkMongoose.find({ categoryid: id }).lean();
    return placemarks;
    }return [];
  },

    async deletePlacemark(id: string) { 
    try {
      await PlacemarkMongoose.deleteOne({ _id: id });
    } catch (error) {
      console.log("bad id");
    }
  },

   async deleteAllPlacemarks() {
    await PlacemarkMongoose.deleteMany({});
  },

   async updatePlacemark(placemark: Placemark, updatedPlacemark: Placemark) {
  

const placemarkDoc = await PlacemarkMongoose.findById(placemark._id);

  if (!placemarkDoc) {
    return null;
  }

  placemarkDoc.name = updatedPlacemark.name;
  // (placemarkDoc as any).category = updatedPlacemark.category;
  placemarkDoc.description = updatedPlacemark.description;

  await placemarkDoc.save();

  const updated = placemarkDoc.toObject();

  return {
    ...updated,
    _id: updated._id.toString(),
    categoryid: updated.categoryid.toString(),
  };

},

};
