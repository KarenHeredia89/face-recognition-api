import { Knex } from "knex";

export const findUserById = async (db: Knex, id: string) => {
  return db.select("*").from("users").where({ id }).first();
};

export const updateUserName = async (db: Knex, id: string, name: string) => {
  return db("users").where({ id }).update({ name }).returning("*");
};
