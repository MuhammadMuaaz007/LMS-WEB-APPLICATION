import { redis } from "../utils/redis.js"
import { Response } from "express";
import userModel from "../models/user.model.js";

export const getUserById = async (id: string) => {
  const userJSON= await redis.get(id) ;
  if(userJSON){
     const user = JSON.parse(userJSON || '{}');
     return user;
  }
  return null;
};