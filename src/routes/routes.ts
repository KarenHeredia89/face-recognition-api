import { Express } from "express";
import { Knex } from "knex";
import bcrypt from "bcrypt-nodejs";

import { authenticateToken } from "../middleware/auth.middleware";

import { handleSignin, handleRegister } from "../controllers/auth.controller";
import {
  handleProfileGet,
  handleProfileUpdate,
} from "../controllers/user.controller";
import { handleImage, handleApiCall } from "../controllers/image.controller";

const routes = (app: Express, db: Knex) => {
  app.post("/signin", handleSignin(db, bcrypt));
  app.post("/register", handleRegister(db, bcrypt));

  app.get("/profile/:id", authenticateToken, handleProfileGet(db));
  app.post("/profile/:id", authenticateToken, handleProfileUpdate(db));

  app.put("/image", authenticateToken, handleImage(db));
  app.post("/imageurl", authenticateToken, handleApiCall);
};

export default routes;
