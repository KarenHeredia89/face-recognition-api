import { Knex } from "knex";
import { findUserById, updateUserName } from "../repositories/user.repository";

interface User {
  id: number;
  name: string;
  email: string;
  entries: number;
  joined: Date;
}

export const getUserById = async (
  db: Knex,
  id: string
): Promise<User | null> => {
  try {
    const user = await findUserById(db, id);
    return user || null;
  } catch (error) {
    console.error("Error getting user by ID:", error);
    return null;
  }
};

export const updateUserById = async (
  db: Knex,
  id: string,
  name: string
): Promise<User | null> => {
  try {
    const [updatedUser] = await updateUserName(db, id, name);
    return updatedUser || null;
  } catch (error) {
    console.error("Error updating user by ID:", error);
    return null;
  }
};
