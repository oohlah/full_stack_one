import Mongoose from "mongoose";
import { MongoPlacemark } from "../../types/object-types.js";

const { Schema } = Mongoose;

const placemarkSchema = new Schema<MongoPlacemark>({
  name: String,
  category: String,
  description: String,

  categoryid: {
    type: Schema.Types.ObjectId,
    ref: "Category",
  },

  location: {
    lat: Number,
    lon: Number,
  },

  temp: Number,
  wind: Number,
});

export const PlacemarkMongoose = Mongoose.model("Placemark", placemarkSchema);
