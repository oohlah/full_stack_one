import { v4 } from "uuid";
import { db } from "./store-utils.js";
import { User } from "../../types/object-types.js";

export const userJsonStore = {
  async getAllUsers(): Promise<User[]> {
    await db.read();
    return db.data.users;
  },

  async addUser(user: User): Promise<User> {
    await db.read();
    user._id = v4();

     // default role as user
  if (!user.scope) {
    user.scope = "user";
  }

    db.data.users.push(user);
    await db.write();
    return user;
  },

  async setAdmin(userid: string): Promise<User | null> {
  await db.read();

  const foundUser = db.data.users.find((u) => u._id === userid);

  if (foundUser) {
    foundUser.scope = "admin";
    await db.write();
    return foundUser;
  }

  return null;
},
  async getUserById(id: string): Promise<User | null> {
    await db.read();
   const user = db.data.users.find((u) => u._id === id);
   return user ?? null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    await db.read();
    const user = db.data.users.find((u) => u.email === email);
    return user ?? null;
  },

  async updateUserName(userid: string, updates: User): Promise <User | null> {
    await db.read();
    const foundUser = db.data.users.find((user) => user._id === userid);
    if (foundUser) {
      // target object, merge source
      Object.assign(foundUser, updates);
      await db.write();
      return foundUser;
    }
    return null;
  },

  async updateUserEmail(userid: string, updatedEmail: string) {
    await db.read();
    const foundUser = db.data.users.find((user) => user._id === userid);
    if (foundUser) {
      // target object, merge source
      Object.assign(foundUser, updatedEmail);
      await db.write();
      return foundUser;
    }
    return null;
  },

    async checkCurrentPassword(currentPassword: string, userid: string): Promise <boolean | null> {
    await db.read();
    const foundUser = db.data.users.find((name) => name._id === userid);
    let match;
    if (foundUser) {
      match = currentPassword === foundUser.password;
    }
    // return true if match else return null
    if (match) {
      return match;
    }
    return null;
  },

   async updatePassword(newPassword: string, userid: string): Promise <string | null> {
    await db.read();
    const foundUser = db.data.users.find((u) => u._id === userid);
    if (foundUser) {
      foundUser.password = newPassword;
      await db.write();
      return foundUser.password;
    }
    return null;
  },

  async deleteUserById(id: string) {
    await db.read();
    const index = db.data.users.findIndex((user) => user._id === id);
    if(index !== -1){db.data.users.splice(index, 1);};
    await db.write();
  },

  async deleteAll() {
    db.data.users = [];
    await db.write();
  },
};
