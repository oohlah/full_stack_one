import { v4 } from "uuid";
import { User } from "../../types/object-types.js";

let users: User[] = [];

export const userMemStore = {
  async getAllUsers() {
    return users;
  },

  async addUser(user: User): Promise<User> {
     const newUser: User = {
    ...user,
    _id: v4(),
    scope: user.scope ?? "user",
     };
    users.push(newUser);
    return newUser;

  },

     // Set a user as admin — scope is a string
  async setAdmin(userid: string): Promise<User | null> {
    const foundUser = users.find((u) => u._id === userid);
    if (foundUser) {
      foundUser.scope = "admin"; // string, same as Firestore
      return foundUser;
    }
    return null;
  },

  async getUserById(id: string): Promise <User | null> {
    const u = users.find((user) => user._id === id);
   return u ?? null;
  },

  async getUserByEmail(email: string): Promise<User | null> {
    let u = users.find((user) => user.email === email);
    return u ?? null;
  },

  async updateUserName(userid: string, updates: User){
   
    // check that both firstname and last name have been added
     if (!updates.firstName || !updates.lastName) {
    throw new Error("Both first and last name required");
}

    const foundUser = users.find((u) => u._id === userid);

    if (foundUser) {
   // Merge target with the source
    Object.assign(foundUser, updates);

    return foundUser;
    }
    return null;
  },
 
  async updateUserEmail(userid: string, updatedEmail: string): Promise<User | null>{
   
  
    const foundUser = users.find((u) => u._id === userid);

    if (foundUser) {
    // Merge target with the source
    Object.assign(foundUser, updatedEmail);
   
  
    return foundUser;
    }
    return null;
  },

  async checkCurrentPassword(currentPassword: string, userid: string): Promise<boolean | null>{
   
  
    const foundUser = users.find((u) => u._id === userid);

    let match;
    if (foundUser) {
      match = currentPassword === foundUser.password;
      return match;
    }
   
    return null;
  },

  async updatePassword(newPassword: string, userid: string): Promise<string | null> {
     
      const foundUser = users.find((u) => u._id === userid);
      if (foundUser) {
        foundUser.password = newPassword;
        return foundUser.password;
      }
      return null;
    },

  async deleteUserById(id: string) {
    const index = users.findIndex((user) => user._id === id);
    if(index !== -1) users.splice(index, 1);
  },

  async deleteAll() {
    users = [];
  },
};
