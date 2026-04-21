import Mongoose from "mongoose";
import { MongoCategory } from "../../types/object-types.js";

const { Schema } = Mongoose;

const categorySchema = new Schema<MongoCategory>({
  title: String,
  img: String,
  userid: {
    type: Schema.Types.ObjectId,
    ref: "User",
  },
});

export const CategoryMongoose = Mongoose.model("Category", categorySchema);
