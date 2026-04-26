import { Types } from "mongoose";

export type FirebaseServiceAccount = {
  projectId: string;
  clientEmail: string;
  privateKey: string;
};


export type User = {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  scope: "user" | "admin";
  
};

export type UserLogin = {
  email: string;
  password: string;
}

export type UserCreate = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
};

export type FirebaseUser = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  scope: "user" | "admin";
}

export type FirebaseUserDoc = FirebaseUser & {
  _id: string;
};

export type Id = Omit<User, "_id">;

export type Location = {
  lat: number;
  lon: number;
};


export type Placemark = {
  _id: string;
  name: string;
  categoryid: string;
  created: number;
  description: string;
  location?: Location | null;
  temp?: number | null;
  wind?: number | null;
};

export type PlacemarkCreate = {
  name: string;
  category?: string | null;
  description: string;
  location?: Location | null;
  temp?: number | null;
  wind?: number | null;
};

// FIRESTORE TYPES:
// ---------------------


export type FirebasePlacemark = {
  name: string;
  categoryid: string;
  created: number;
  description: string;
  location?: Location;
  temp?: number;
  wind?: number;
};

// MONGO TYPES:
// ---------------------
export type MongoPlacemark = {
 _id: Types.ObjectId;
  name: string;
  category?: string;
  categoryid: Types.ObjectId;
  created: number;
  description: string;
  location?: {
    lat: number;
    lon: number;
  };
  temp?: number;
  wind?: number;
};

export type FirebasePlacemarkDoc = FirebasePlacemark & {
  _id: string;
};

export type Category = {
    _id: string,
    title: string;
    img?: string;
    placemarks?: Placemark[]
}

export type CategoryCreate = {
  title: string;
   img?: string;
 
};


// FIRESTORE TYPES:

export type FirebaseCategory = {
  title: string;
  img?: string;
  userid: string;
};

// MONGO TYPES:
// ---------------------
export type MongoCategory = {
 _id: Types.ObjectId;
   title: string;
  img?: string;
  userid: Types.ObjectId;
  
};


export type CategoryWithPlacemarks = FirebaseCategoryDoc & {
  placemarks: Placemark[];
};

export type FirebaseCategoryDoc = FirebaseCategory & {
  _id: string;
};

//Db

export type Db = {
  userStore: any,
  categoryStore: any,
  placemarkStore: any,
  init: any
}

//GEO-UTILS:
// -----------

export type Weather = {
  temperature: number;
  windSpeed: number;
};