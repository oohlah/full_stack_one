import Mongoose from "mongoose";

const { Schema } = Mongoose;

const placemarkSchema = new Schema({
  name: String,
  category: String,
  description: String,
  categoryid: {
    type: Schema.Types.ObjectId,
    ref: "Placemark",
  },
  location: {
    lat: Number,
    lon: Number
  },
  temp: Number,
  wind: Number
  },
);

export const Placemark = Mongoose.model("Placemark", placemarkSchema);
