import dotenv from "dotenv";

import admin from "firebase-admin";

dotenv.config();


// replace back spaces in env with actual newline characters
const privateKey = process.env.firebase_private_key.replace(/\\n/g, '\n');

try {
    // Initialize Firebase Admin with Application Default Credentials - env variable set in terminal
  admin.initializeApp({
  credential: admin.credential.cert({
  type: process.env.firebase_type,
  project_id: process.env.firebase_project_id,
  private_key: privateKey,
  client_email: process.env.firebase_client_email,
    }),
  }); 
  console.log("Firebase initialized");
} catch (err) {
  console.error("Firebase failed:", err);
}

export const firestore = admin.firestore();