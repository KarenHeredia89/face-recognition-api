import { Request, Response } from "express";
import { Knex } from "knex";
import { getAuthUser, registerUser } from "../services/auth.service";

export const handleSignin =
  (db: Knex, bcrypt: any) => async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json("incorrect form submission");
    }

    const user = await getAuthUser(db, email, password);

    if (user) {
      res.json(user);
    } else {
      res.status(400).json("wrong credentials");
    }
  };

export const handleRegister =
  (db: Knex, bcrypt: any) => async (req: Request, res: Response) => {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json("incorrect form submission");
    }

    const newUser = await registerUser(db, name, email, password);

    if (newUser) {
      res.json(newUser);
    } else {
      res.status(400).json("unable to register");
    }
  };
