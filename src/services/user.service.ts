import { Knex } from "knex";

interface User {
  id: number;
  name: string;
  email: string;
  entries: number;
  joined: Date;
  age?: number;
}

export const getUserById = async (
  db: Knex,
  id: string
): Promise<User | null> => {
  try {
    const users = await db.select("*").from("users").where({ id });

    if (users.length) {
      return users[0];
    }
    return null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

export const updateUserById = async (
  db: Knex,
  id: string,
  name: string,
  age: number
): Promise<User | null> => {
  try {
    const users = await db("users")
      .where({ id })
      .update({ name })
      .returning("*");

    if (users.length > 0) {
      return users[0];
    }
    return null;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return null;
  }
};
