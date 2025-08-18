import { Request, Response } from "express";
import { Knex } from "knex";
import { callClarifaiApi, incrementEntries } from "../services/image.service";
import {
  clarifaiApiSchema,
  incrementEntriesSchema,
} from "../schemas/image.schemas";

export const handleApiCall = (req: Request, res: Response) => {
  const validation = clarifaiApiSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.issues });
  }

  const { input } = validation.data;

  callClarifaiApi(input)
    .then((data) => res.json(data))
    .catch((err) =>
      res.status(400).json({ message: "Error with Clarifai API" })
    );
};

export const handleImage =
  (db: Knex) => async (req: Request, res: Response) => {
    const validation = incrementEntriesSchema.safeParse(req.body);

    if (!validation.success) {
      return res.status(400).json({ errors: validation.error.issues });
    }

    const { id } = validation.data;

    const entries = await incrementEntries(db, Number(id));

    if (entries) {
      res.json(entries);
    } else {
      res.status(400).json({ message: "Unable to get entries" });
    }
  };
