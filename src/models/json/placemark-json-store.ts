import { v4 } from "uuid";
import { db } from "./store-utils.js"; 
import { Placemark } from "../../types/object-types.js";

export const placemarkJsonStore = {
  async getAllPlacemarks() {
    await db.read();
    return db.data.placemarks;
  },

  async addPlacemark(categoryId: string, placemark: Placemark): Promise<Placemark> {
    await db.read();
    placemark._id = v4();
    (placemark as any).categoryid = categoryId;
    db.data.placemarks.push(placemark);
    await db.write();
    return placemark;
  },

  async getPlacemarksByCategoryId(id: string): Promise<Placemark[]> {
    await db.read();
    return db.data.placemarks.filter((placemark: Placemark) => (placemark as any).categoryid === id);
  },

  async getPlacemarkById(id: string): Promise<Placemark | null> {
  await db.read();

  const p = db.data.placemarks.find(
    (placemark: Placemark) => placemark._id === id
  );

  return p ?? null;
      
  },

  async deletePlacemark(id: string) {
    await db.read();
    const index = db.data.placemarks.findIndex((placemark: Placemark) => placemark._id === id);
    db.data.placemarks.splice(index, 1);
    await db.write();
  },

  async deleteAllPlacemarks() {
    db.data.placemarks = [];
    await db.write();
  },

  async updatePlacemark(placemark: Placemark, updatedPlacemark: Placemark) {
    placemark.name = updatedPlacemark.name;
    placemark.description = updatedPlacemark.description;
    await db.write();
  },
};
