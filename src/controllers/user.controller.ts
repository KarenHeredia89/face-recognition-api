import { Request, Response } from "express";
import { Knex } from "knex";
import { getUserById } from "../services/user.service";

export const handleProfileGet =
  (db: Knex) => async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await getUserById(db, id);

    if (user) {
      res.json(user);
    } else {
      res.status(400).json("Not found");
    }
  };
