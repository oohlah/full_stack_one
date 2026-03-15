import { v4 } from "uuid";
import { db } from "./store-utils.js";

export const userJsonStore = {
  async getAllUsers() {
    await db.read();
    return db.data.users;
  },

  async addUser(user) {
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

  async setAdmin(userid) {
  await db.read();

  const foundUser = db.data.users.find((u) => u._id === userid);

  if (foundUser) {
    foundUser.scope = "admin";
    await db.write();
    return foundUser;
  }

  return null;
},
  async getUserById(id) {
    await db.read();
    let u = db.data.users.find((user) => user._id === id);
    if(u === undefined){u = null};
    return u;
  },

  async getUserByEmail(email) {
    await db.read();
    let u = db.data.users.find((user) => user.email === email);
    if(u === undefined){u = null};
    return u;
  },

  async updateUserName(userid, updates) {
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

  async updateUserEmail(userid, updatedEmail) {
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

    async checkCurrentPassword(currentPassword, userid) {
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

   async updatePassword(newPassword, userid) {
    await db.read();
    const foundUser = db.data.users.find((u) => u._id === userid);
    if (foundUser) {
      foundUser.password = newPassword;
      await db.write();
      return foundUser.password;
    }
    return null;
  },

  async deleteUserById(id) {
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
