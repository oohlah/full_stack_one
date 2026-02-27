import { assert } from "chai";
import { db } from "../src/models/db.js";
export const serviceUrl = "http://localhost:4000";

export const maggie = {
    firstName: "Maggie",
    lastName: "Simpson",
    email: "maggie@simpson.com",
    password: "secret",

};

export const testUsers = [
  {
    firstName: "Homer",
    lastName: "Simpson",
    email: "homer@simpson.com",
    password: "secret"
  },
  {
    firstName: "Marge",
    lastName: "Simpson",
    email: "marge@simpson.com",
    password: "secret"
  },
  {
    firstName: "Bart",
    lastName: "Simpson",
    email: "bart@simpson.com",
    password: "secret"
  }
];

export const river = {
    title: "River",
    
};

export const testCategories = [
  {
    title: "Bridge"
  },
  {
    title: "Museaum"
  },
  {
    title: "Mountain"
  }
];


export const liffey = {
  name: "Liffey",
  description: "It's in Europe"
}
export const testPlacemarks = [
  {
    name: "Liffey",
    description: "it's in Europe"
  },

  {
    name: "Yangtze",
    description: "it's in Asia"
  },
{
   name: "Missisippi",
   description: "It's in North America"
}
]