import { redis } from "../utils/redis.js";
import { Response } from "express";
import userModel from "../models/user.model.js";

// create user service
export const getUserById = async (id: string) => {
  const userJSON = await redis.get(id);
  if (userJSON) {
    const user = JSON.parse(userJSON || "{}");
    return user;
  }
  return null;
};

export const getAllUsersService = async (res: Response) => {
  const users = await userModel.find().sort({ createdAt: -1 });
  res.status(200).json({
    success: true,
    users,
  });
};
