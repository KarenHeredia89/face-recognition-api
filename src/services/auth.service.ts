import { Knex } from "knex";
import bcrypt from "bcrypt-nodejs";

interface User {
  id: number;
  name: string;
  email: string;
  entries: number;
  joined: Date;
}

export const getAuthUser = async (
  db: Knex,
  email: string,
  passwordFromReq: string
) => {
  try {
    const data = await db
      .select("email", "hash")
      .from("login")
      .where("email", "=", email);

    if (!data || data.length === 0) {
      return null;
    }

    const isValid = bcrypt.compareSync(passwordFromReq, data[0].hash);
    if (!isValid) {
      return null;
    }

    const user = await db.select("*").from("users").where("email", "=", email);
    if (!user || user.length === 0) {
      return null;
    }

    return user[0];
  } catch (error) {
    return null;
  }
};

export const registerUser = async (
  db: Knex,
  name: string,
  email: string,
  passwordFromReq: string
): Promise<User | null> => {
  const hash = bcrypt.hashSync(passwordFromReq);

  try {
    const registeredUser = await db.transaction(async (trx) => {
      const loginEmails = await trx("login")
        .insert({
          hash: hash,
          email: email,
        })
        .returning("email");

      if (!loginEmails || loginEmails.length === 0) {
        throw new Error("Failed to insert login email.");
      }

      const loginEmail = loginEmails[0].email;

      const [userId] = await trx("users")
        .insert({
          name: name,
          email: loginEmail,
          joined: new Date(),
        })
        .returning("id");

      if (!userId) {
        throw new Error("Failed to insert new user.");
      }

      const registeredUser = await trx("users").where("id", userId).first();

      if (!registeredUser) {
        throw new Error("Failed to fetch user after registration.");
      }

      return registeredUser;
    });

    return registeredUser;
  } catch (error) {
    console.error("Error during user registration:", error);
    return null;
  }
};
