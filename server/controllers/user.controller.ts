import type { NextFunction, Request, Response } from "express"; // Add Request and Response here
import userModel, { IUser } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import bcrypt from "bcryptjs";
import jwt, { type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMailer from "../utils/sendmail.js";
dotenv.config();


interface IRegistrationBody{
  name:string;
  email:string;
  avatar?:string;
  password:string;
}

export const registrationUser= CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
      // @ts-ignore
      const {name,email,password}=req.body;
      const isEmailExist=await userModel.findOne({email});
      if(isEmailExist){
        return next(new ErrorHandler("Email already exist",400));
      }
      const user:IRegistrationBody={
        name,email,password
      }
      const {token,activationCode}=createActivationToken(user);
      const data={user:{name:user.name},activationCode}
      //  const html = await ejs.renderFile(path.join(__dirname, "../mails/activation-mailer.ejs"), data);
          try {
            await sendMailer({
                email: user.email,
                subject: "Activate your account",
                template: "activation.mail.ejs",  // Ensure the template name is correct /activation-mailer.
                data,
            });

            res.status(201).json({
                success: true,
                message: `Please check your email: ${user.email} to activate your account!`,
                activationToken: token, 
                user 
            });
            
        } catch (err: any) {
            return next(new ErrorHandler(err.message, 400));
        }
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


// activate user
interface IActivationRequest {
  activation_token: string;
  activation_code: string;
}

export const activateUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { activation_token, activation_code } = req.body;      // as IActivationRequest;
    
    const newUser: { user: IUser; activationCode: string } = jwt.verify(
      activation_token,
      process.env.ACTIVATION_SECRET as string
    ) as { user: IUser; activationCode: string };

    if (newUser.activationCode !== activation_code) {
      return next(new ErrorHandler("Invalid activation code", 400));
    }

    const { name, email, password } = newUser.user;

    const existUser = await userModel.findOne({ email });

    if (existUser) {
      return next(new ErrorHandler("Email already exist", 400));
    }

    const user = await userModel.create({
      name,
      email,
      password,
    });

    res.status(201).json({
      success: true,
      user,
    });
  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

