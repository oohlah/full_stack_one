import { JSONFilePreset } from "lowdb/node";
import { Category, Placemark, User } from "../../types/object-types.js";

type Data = {
  users: User[];
  categories: Category[];
  placemarks: Placemark[];
};

export const db = await JSONFilePreset<Data>(
  "src/models/json/db.json",
  {
    users: [],
    categories: [],
    placemarks: [],
  }
);