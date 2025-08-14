import { Express } from "express";
import { Knex } from "knex";
import bcrypt from "bcrypt-nodejs";

import { handleSignin, handleRegister } from "../controllers/auth.controller";
import {
  handleProfileGet,
  handleProfileUpdate,
} from "../controllers/user.controller";
import { handleImage, handleApiCall } from "../controllers/image.controller";

const routes = (app: Express, db: Knex) => {
  app.post("/signin", handleSignin(db, bcrypt));
  app.post("/register", handleRegister(db, bcrypt));

  app.get("/profile/:id", handleProfileGet(db));
  app.post("/profile/:id", handleProfileUpdate(db));

  app.put("/image", handleImage(db));
  app.post("/imageurl", handleApiCall);
};

export default routes;
