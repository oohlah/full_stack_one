/* eslint-disable import/no-extraneous-dependencies */
import jwt, { SignOptions, JwtPayload }from "jsonwebtoken";
import dotenv from "dotenv";
import { db } from "../models/db.js";
import { User } from "../types/object-types.js";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";


const result = dotenv.config();

export function createToken(user: User): string {
  const payload = {
    id: user._id,
    email: user.email,
    scope: user.scope, // property given -admin or user
  };
  const options: SignOptions = {
    algorithm: "HS256",
    expiresIn: "1h",
  };

  const secret = process.env.cookie_password;

if (!secret) {
  throw new Error("JWT secret not defined");
}
  return jwt.sign(payload, secret, options);
}

export function decodeToken(token: string): JwtPayload | null {

  type UserInfo = {
  userId?: string;
  email?: string;
};

  const userInfo: UserInfo = {};
  try {
    const secret = process.env.cookie_password;

    if (!secret) {
    throw new Error("JWT secret not defined");
    }
    const decoded = jwt.verify(token, secret) as jwt.JwtPayload;
    userInfo.userId = decoded.id;
    userInfo.email = decoded.email;
    
  } catch (e: any) {
    console.log(e.message);
  }
  return userInfo;
}

export async function validate(decoded: any, request: Request) {
  const user = await db.userStore.getUserById(decoded.id);
  if (!user) {
    return { isValid: false };
  }
  return { isValid: true, credentials: user };
}
