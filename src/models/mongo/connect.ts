/* eslint-disable import/no-extraneous-dependencies */
import * as dotenv from "dotenv";
import Mongoose from "mongoose";
// @ts-ignore
import * as mongooseSeeder from "mais-mongoose-seeder";
import { seedData } from "./seed-data.js";
// import { Db } from "../../types/object-types.js";

const seedLib = mongooseSeeder.default;

async function seed() {
  const seeder = seedLib(Mongoose);
  // drop seeded data each time local restart
  const dbData = await seeder.seed(seedData, { dropDatabase: true, dropCollections: true });
  console.log(dbData);
}

export function connectMongo() {
  dotenv.config();

  Mongoose.set("strictQuery", true);
   const mongoUrl = process.env.db;
  if (!mongoUrl) throw new Error("Missing DB connection string");


   Mongoose.connect(mongoUrl);

  const connection = Mongoose.connection;

  connection.on("error", (err) => {
    console.log(`database connection error: ${err}`);
  });

  connection.on("disconnected", () => {
    console.log("database disconnected");
  });

  connection.once("open", () => {
    console.log("database connected");
    seed();
  });
}
