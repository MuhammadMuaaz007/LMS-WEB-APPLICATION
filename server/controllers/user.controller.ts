
import userModel from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import bcrypt from "bcryptjs";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import type { NextFunction } from "express";
dotenv.config();


interface IRegistrationBody{
  name:string;
  email:string;
  avatar?:string;
  password:string;
}

export const registrationUser= CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
      const {name,email,password}=req.body;
      const isEmailExist=await userModel.findOne({email});
      if(isEmailExist){
        return next(new ErrorHandler("Email already exist",400));
      }
      const user:IRegistrationBody={
        name,email,password
      }
      const {token,activationCode}=createActivationToken(user);
      const data={user:{user:user.name},activationCode}
       const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mailer.ejs"), data);
       



  } catch (error:any) {
    return next(new ErrorHandler(error.message,400));
    
  }

});

interface IActivationToken{
  token:string,
  activationCode:string;
}
const createActivationToken=(user:any):IActivationToken=>{
  const activationCode=Math.floor(1000+Math.random()*9000).toString();
  const token=jwt.sign({user,activationCode},process.env.ACTIVATION_SECRET as Secret,{expiresIn:"5m"});
  return {token,activationCode};
}

