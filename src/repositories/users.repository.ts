import { Knex } from "knex";

export const findUserByMail = async (db: Knex, email: string) => {
  return db.select("*").from("users").where("email", "=", email).first();
};

export const insertUser = async (
  db: Knex.Transaction,
  name: string,
  email: string
) => {
  return db("users")
    .insert({ name: name, email: email, joined: new Date() })
    .returning("*");
};
