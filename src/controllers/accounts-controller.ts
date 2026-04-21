import { db } from "../models/db.js";
import { UserSpec, UserCredentialsSpec } from "../models/joi-schema.js";
import { Request, ResponseObject, ResponseToolkit } from "@hapi/hapi";

export const accountsController = {
  index: {
    auth:false,
    handler: function (request: Request, h: ResponseToolkit) {
      return h.view("main", { title: "Welcome to PlaceMark" });
    },
  },
  showSignup: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit) {
      return h.view("signup-view", { title: "Sign up for PlaceMark" });
    },
  },
  signup: {
    auth: false,
    validate: {
      payload: UserSpec,
      options: {abortEarly: false},
      failAction: function (request: Request, h: ResponseToolkit, error: any) {
        return h.view("signup-view", { title: "Sign up error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit) {
      const user = request.payload;
      await db.userStore.addUser(user);
      return h.redirect("/");

    },
  },
  showLogin: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit) {
      return h.view("login-view", { title: "Login to PlaceMark" });
    },
  },
  login: {
    auth: false,
    validate: {
      payload: UserCredentialsSpec,
      options: {abortEarly: false},
      failAction: function (request: Request, h: ResponseToolkit, error: any) {

        return h.view("login-view", { title: "Login error", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request: Request, h: ResponseToolkit) {

      const payload = request.payload as {
        email: string;
        password?: string;
       };

      const { email, password } = payload;
      const user = await db.userStore.getUserByEmail(email);
      if (!user || user.password !== password) {
        return h.redirect("/");
      }
      // store user id and scope in cookie
       request.cookieAuth.set({
        id: user._id,
      scope: user.scope || "user", // default to "user" if missing
    });
      // request.cookieAuth.set({ id: user._id });
      return h.redirect("/dashboard");
    },
  },
  logout: {
    auth: false,
    handler: function (request: Request, h: ResponseToolkit) {
      return h.redirect("/");
    },
  },

   async validate(request: Request, session: any) {
    const user = await db.userStore.getUserById(session.id);
    if (!user) {
      return { isValid: false };
    }
    return { isValid: true, credentials: user };
  },
};

