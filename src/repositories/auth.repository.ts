import { Knex } from "knex";

export const findLoginByEmail = async (db: Knex, email: string) => {
  return db
    .select("email", "hash")
    .from("login")
    .where("email", "=", email)
    .first();
};

export const insertLogin = async (
  db: Knex.Transaction,
  email: string,
  hash: string
) => {
  return db("login").insert({ email: email, hash: hash }).returning("email");
};
