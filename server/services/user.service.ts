import { redis } from "../utils/redis.js"
import { Response } from "express";
import userModel from "../models/user.model.js";

export const getUserById = async (id: string) => {
  const user = await userModel.findById(id);
  return user;
};