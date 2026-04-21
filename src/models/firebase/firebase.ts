import dotenv from "dotenv";

import admin from "firebase-admin";

import {FirebaseServiceAccount } from "../../types/object-types.js";

dotenv.config();


// replace back spaces in env with actual newline characters

const rawPrivateKey = process.env.firebase_private_key;

if (!rawPrivateKey) {
  throw new Error("Missing firebase_private_key");
}

const privateKey = rawPrivateKey.replace(/\\n/g, "\n");

const serviceAccount: FirebaseServiceAccount = {
  projectId: process.env.firebase_project_id!,
  clientEmail: process.env.firebase_client_email!,
  privateKey,
}
try {
    // Initialize Firebase Admin with Application Default Credentials - env variable set in terminal
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
  
  }); 
  
  console.log("Firebase initialized");
} catch (err) {
  console.error("Firebase failed:", err);
}

export const firestore = admin.firestore();