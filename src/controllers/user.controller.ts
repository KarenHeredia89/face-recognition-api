import { Request, Response } from "express";
import { Knex } from "knex";
import { getUserById, updateUserById } from "../services/user.service";
import { profileUpdateSchema } from "../schemas/user.schemas";

export const handleProfileGet =
  (db: Knex) => async (req: Request, res: Response) => {
    const { id } = req.params;

    const user = await getUserById(db, id);

    if (user) {
      res.json(user);
    } else {
      res.status(400).json({ message: "Not found" });
    }
  };

export const handleProfileUpdate =
  (db: Knex) => async (req: Request, res: Response) => {
    const validation = profileUpdateSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues });
    }

    const { id } = req.params;
    const { name } = validation.data.formInput;

    try {
      const updatedUser = await updateUserById(db, id, name);
      if (updatedUser) {
        res.json(updatedUser);
      } else {
        res.status(400).json({ message: "Not found" });
      }
    } catch (error) {
      console.error("Error updating user by ID:", error);
      res.status(400).json({ message: "Unable to update user" });
    }
  };
