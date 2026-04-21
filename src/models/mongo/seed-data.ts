export const seedData = {
  users: {
    _model: "User",
    homer: {
      firstName: "Homer",
      lastName: "Simpson",
      email: "homer@simpson.com",
      password: "secret"
    },
    marge: {
      firstName: "Marge",
      lastName: "Simpson",
      email: "marge@simpson.com",
      password: "secret"
    },
    bart: {
      firstName: "Bart",
      lastName: "Simpson",
      email: "bart@simpson.com",
      password: "secret"
    }
  },
  categories: {
    _model: "Category",
    rivers: {
      title: "Rivers",
      userid: "->users.bart"
    }
  },
  placemarks: {
    _model : "Placemark",
    placemark_1 : {
      name: "liffey",
      category: "Rivers",
      description: "It's a River in Dublin",
      categoryid: "->categories.rivers"
    },
    placemark_2 : {
      name: "Yangtze River",
      category: "Rivers",
      description: "It's a River in China",
      categoryid: "->categories.rivers"
    },
    placemark_3 : {
      name: "Congo River",
      category: "Rivers",
      description: "It's a River in the Congo",
      categoryid: "->categories.rivers"
  }
}
};
