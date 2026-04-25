/* eslint-disable import/no-extraneous-dependencies */
import Hapi, { Server } from "@hapi/hapi";
import Vision from "@hapi/vision";
import Inert from "@hapi/inert";
import Cookie from "@hapi/cookie";
import HapiSwagger from "hapi-swagger";
import dotenv from "dotenv";
import Handlebars from "handlebars";
import Joi from "joi";
// @ts-ignore
import * as jwt from "hapi-auth-jwt2";
import path from "path";
import { fileURLToPath } from "url";
import { webRoutes } from "./web-routes.js";
// import { db } from "./models/db.js";
import { accountsController} from "./controllers/accounts-controller.js";
import { validate } from "./api/jwt-utils.js";
import { apiRoutes } from "./api-routes.js";


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log("Starting server...")

const result = dotenv.config();
if (result.error) {
  console.log(result.error.message);
  // process.exit(1);
}


const swaggerOptions = {
  info: {
    title: "Placemark API",
    version: "0.1",
  },
   securityDefinitions: {
    jwt: {
      type: "apiKey",
      name: "Authorization",
      in: "header"
    }
  },
  security: [{ jwt: [] }]
};

async function init() {
  console.log("STEP 1: Creating Hapi server")
  const server = Hapi.server({
    port: process.env.PORT || 4000,
    host: "0.0.0.0", // default host on render
    routes: { cors: true },
     
  });
    console.log("STEP 2: Server created")

    console.log("STEP 3: Registering plugins (Cookie, JWT, Swagger)")
    await server.register(Cookie);
    await server.register(jwt);
    await server.register([
    Inert,
    Vision,
    {
      plugin: HapiSwagger,
      options: swaggerOptions,
    },
  ]);

  server.validator(Joi);
  server.views({
    engines: {
      hbs: Handlebars,
    },
    relativeTo: __dirname,
    path: "./views",
    layoutPath: "./views/layouts",
    partialsPath: "./views/partials",
    layout: true,
    isCached: false,
  });
  

   server.auth.strategy("session", "cookie", {
    cookie: {
      name: process.env.cookie_name,
      password: process.env.cookie_password,
      isSecure: false,
    },
    redirectTo: "/",
    validate: accountsController.validate,
  });
   server.auth.strategy("jwt", "jwt", {
    key: process.env.cookie_password,
    validate: validate,
    verifyOptions: { algorithms: ["HS256"] },
  });
 

  server.auth.default("session");


 
  // db.init("firebase");

  // db.init("mongo");
  server.route(webRoutes);
  server.route(apiRoutes);
  await server.start();
  await server.register(Inert);
  console.log("Server running on %s", server.info.uri);
}

process.on("unhandledRejection", (err) => {
  console.log(err);
  // process.exit(1);
});

init();

