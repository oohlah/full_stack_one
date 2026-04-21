import { v4 } from "uuid";
import { Placemark } from "../../types/object-types.js";

let placemarks: Placemark[] = [];

export const placemarkMemStore = {
  async getAllPlacemarks(): Promise<Placemark[]> {
    return placemarks;
  },

    async addPlacemark(categoryId: string, placemark: Placemark): Promise<Placemark> {
    placemark._id = v4();
    (placemark as any).categoryid = categoryId;
    placemarks.push(placemark);
    return placemark;
  },

  async getPlacemarksByCategoryId(id: string): Promise<Placemark[]> {
    return placemarks.filter((placemark) => (placemark as any).categoryid === id);
  },

  async getPlacemarkById(id: string): Promise<Placemark | null>{
    const p = placemarks.find((placemark) => placemark._id === id);
    return p ?? null;
  },

   async updatePlacemark(id: string, updatedPlacemark: Placemark): Promise<Placemark | null> {
      const p = placemarks.find((placemark) => placemark._id === id);

  if (!p) return null;

  p.name = updatedPlacemark.name;
  p.description = updatedPlacemark.description;

  return p;
  },

   async deletePlacemark(id: string) { 
    const index = placemarks.findIndex((placemark) => placemark._id === id);
    if (index !== -1) placemarks.splice(index, 1);
  },

  async deleteAllPlacemarks() {
    placemarks = [];
  }
};