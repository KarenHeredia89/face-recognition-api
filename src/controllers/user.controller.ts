import { Request, Response } from "express";
import { Knex } from "knex";
import { getUserById, updateUserById } from "../services/user.service";

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

export const handleProfileUpdate =
  (db: Knex) => async (req: Request, res: Response) => {
    const { id } = req.params;

    const { name, age } = req.body.formInput;

    if (!name && !age) {
      return res.status(400).json("No data to update");
    }

    if (age && typeof age !== "number") {
      return res.status(400).json("Age must be a number");
    }

    try {
      const updatedUser = await updateUserById(db, id, name, age);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(400).json("Not found");
      }
    } catch (error) {
      console.error("Error updating user by ID:", error);
      res.status(400).json("Unable to update user");
    }
  };
