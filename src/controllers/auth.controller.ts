import { Request, Response } from "express";
import { Knex } from "knex";
import { getAuthUser, registerUser } from "../services/auth.service";
import { registerUserSchema, loginUserSchema } from "../schemas/user.schemas";

const handleSignin = (db: Knex) => async (req: Request, res: Response) => {
  const validation = loginUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.issues });
  }
  const { email, password } = validation.data;

  const user = await getAuthUser(db, email, password);

  if (user) {
    res.json(user);
  } else {
    res.status(400).json({ message: "Wrong credentials" });
  }
};

const handleRegister = (db: Knex) => async (req: Request, res: Response) => {
  const validation = registerUserSchema.safeParse(req.body);

  if (!validation.success) {
    return res.status(400).json({ errors: validation.error.issues });
  }

  const { email, password, name } = validation.data;

  const newUser = await registerUser(db, name, email, password);

  if (newUser) {
    res.json(newUser);
  } else {
    res.status(400).json({ message: "Unable to register" });
  }
};

export { handleSignin, handleRegister };
