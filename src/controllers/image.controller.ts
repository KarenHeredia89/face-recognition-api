import { Request, Response } from "express";
import { Knex } from "knex";
import { callClarifaiApi, incrementEntries } from "../services/image.service";

export const handleApiCall = (req: Request, res: Response) => {
  const { input } = req.body;

  callClarifaiApi(input)
    .then((data) => res.json(data))
    .catch((err) => res.status(400).json("Error with Clarifai API"));
};

export const handleImage =
  (db: Knex) => async (req: Request, res: Response) => {
    const { id } = req.body;
    if (!id) {
      return res.status(400).json("Missing user ID");
    }

    const entries = await incrementEntries(db, id);

    if (entries) {
      res.json(entries);
    } else {
      res.status(400).json("Unable to get entries");
    }
  };
