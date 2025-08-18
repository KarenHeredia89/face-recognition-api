import { Knex } from "knex";

export const incrementUserEntries = async (db: Knex, id: number) => {
  return db("users")
    .where("id", "=", id)
    .increment("entries", 1)
    .returning("entries");
};
