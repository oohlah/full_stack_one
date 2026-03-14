import { v4 } from "uuid";

let users = [];

export const userMemStore = {
  async getAllUsers() {
    return users;
  },

  async addUser(user) {
    user._id = v4();
    users.push(user);
    return user;
  },

  async getUserById(id) {
    let u = users.find((user) => user._id === id);
    if(u === undefined){u = null};
    return u;
  },

  async getUserByEmail(email) {
    let u = users.find((user) => user.email === email);
    if(u === undefined){u = null};
    return u;
  },

  async updateUserName(userid, updates){
   
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
 
  async updateUserEmail(userid, updatedEmail){
   
  
    const foundUser = users.find((u) => u._id === userid);

    if (foundUser) {
    // Merge target with the source
    Object.assign(foundUser, updatedEmail);
   
  
    return foundUser;
    }
    return null;
  },

  async deleteUserById(id) {
    const index = users.findIndex((user) => user._id === id);
    if(index !== -1) users.splice(index, 1);
  },

  async deleteAll() {
    users = [];
  },
};
