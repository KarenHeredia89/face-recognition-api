import { Knex } from "knex";
import bcrypt from "bcrypt-nodejs";
import jwt from "jsonwebtoken";
import redisClient from "../config/redisClient";
import { findUserByMail, insertUser } from "../repositories/users.repository";
import { findLoginByEmail, insertLogin } from "../repositories/auth.repository";

interface User {
  id: number;
  name: string;
  email: string;
  entries: number;
  joined: Date;
}

const jwtSecret = process.env.JWT_SECRET;
const expirationInSeconds = 3600;

export const getAuthUser = async (
  db: Knex,
  email: string,
  passwordFromReq: string
) => {
  try {
    const loginData = await findLoginByEmail(db, email);

    if (!loginData) return null;

    const isValid = bcrypt.compareSync(passwordFromReq, loginData.hash);

    if (!isValid) return null;

    const user = await findUserByMail(db, email);

    if (!user) return null;

    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }

    const token = jwt.sign({ id: user.id }, jwtSecret, {
      expiresIn: expirationInSeconds,
    });

    await redisClient.setEx(
      `token:${token}`,
      expirationInSeconds,
      user.id.toString()
    );

    return { user, token };
  } catch (error) {
    console.error("Error authenticating user:", error);
    return null;
  }
};

export const registerUser = async (
  db: Knex,
  name: string,
  email: string,
  passwordFromReq: string
): Promise<{ user: User; token: string } | null> => {
  const salt = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(passwordFromReq, salt);

  try {
    const registeredUser = await db.transaction(async (trx) => {
      const [loginEmail] = await insertLogin(trx, email, hash);

      if (!loginEmail) {
        throw new Error("Failed to insert login email.");
      }

      const [newUser] = await insertUser(trx, name, email);

      if (!newUser) {
        throw new Error("Failed to insert new user.");
      }

      return newUser;
    });

    if (registeredUser) {
      if (!jwtSecret) {
        throw new Error("JWT secret is not defined");
      }

      const token = jwt.sign({ id: registeredUser.id }, jwtSecret, {
        expiresIn: expirationInSeconds,
      });

      await redisClient.setEx(
        `token:${token}`,
        expirationInSeconds,
        registeredUser.id.toString()
      );

      return { user: registeredUser, token };
    }

    return registeredUser;
  } catch (error) {
    console.error("Error during user registration:", error);
    return null;
  }
};
