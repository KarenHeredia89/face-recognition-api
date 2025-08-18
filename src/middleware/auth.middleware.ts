import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import redisClient from "../config/redisClient";

const jwtSecret = process.env.JWT_SECRET;

export const authenticateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res
        .status(401)
        .json({ message: "Authorization header is missing or invalid" });
    }

    const token = authHeader && authHeader.split(" ")[1];

    if (token == null) return res.sendStatus(401);

    if (!jwtSecret) {
      throw new Error("JWT secret is not defined");
    }

    const decoded = jwt.verify(token, jwtSecret);
    if (!decoded || typeof decoded === "string") {
      return res.status(401).json({ message: "Invalid token" });
    }

    const userExists = await redisClient.get(`token:${token}`);
    if (!userExists)
      return res
        .sendStatus(401)
        .json({ message: "Session expired or invalid token" });

    (req as any).userId = decoded.id;
    next();
  } catch (error) {
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ message: "Invalid token" });
    }
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
