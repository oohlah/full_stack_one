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
   
     if (!updates.firstName || !updates.lastName) {
    throw new Error("Both first and last name required");
}

    const foundUser = users.find((u) => u._id === userid);

    if (foundUser) {
    // Merge the updates with existing user
    Object.assign(foundUser, updates);

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
