import type { NextFunction, Request, Response } from "express"; // Add Request and Response here
import userModel, { IUser } from "../models/user.model.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import { CatchAsyncError } from "../middleware/catchAsyncErrors.js";
import bcrypt from "bcryptjs";
import jwt, { JwtPayload, type Secret } from "jsonwebtoken";
import dotenv from "dotenv";
import ejs from "ejs";
import path from "path";
import sendMailer from "../utils/sendmail.js";
import { accessTokenOptions, refreshTokenOptions, sendToken } from "../utils/jwt.js";
import { redis } from "../utils/redis.js";
import { getUserById } from "../services/user.service.js";
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

// Login user
interface ILoginRequest {
  email: string;
  password: string;
}

export const loginUser = CatchAsyncError(async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body as ILoginRequest || '';

    if (!email || !password) {
      return next(new ErrorHandler("Please enter email and password", 400));
    }

    const user = await userModel.findOne({ email }).select("+password");

    if (!user) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }
    sendToken(user, 200, res);
  

  } catch (error: any) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// logout user

export const logoutUser=CatchAsyncError(async(req:Request,res:Response,next:NextFunction)=>{
  try {
    res.cookie("access_token","",{maxAge:1});
    res.cookie("refresh_token","",{maxAge:1});
    const userID=req.user?._id || '';
    redis.del(userID.toString());
    res.status(200).json({
      success:true,
      message:"Logged out successfully"
    })
  } catch (error:any) {
    return next(new ErrorHandler(error.message,400))
  }
})



export const updateAccessToken=CatchAsyncError(
    async(req:Request,res:Response, next:NextFunction)=>{

        try{
            const refresh_Token=req.cookies.refresh_token as string;
            const decoded=jwt.verify(refresh_Token,process.env.REFRESH_TOKEN as string) as JwtPayload;

            if(!decoded)
            {
                return next(new ErrorHandler("Could not refresh token",400))
            }
        
            const session_user_redis=await redis.get(decoded.id)
            if(!session_user_redis){
                return next(new ErrorHandler("PLZ login to access this ",400))

            }

            const user=JSON.parse(session_user_redis) // JSON.parse() → string ➜ object  JSON.stringify() → object ➜ string
            const accessToken=jwt.sign({id:user._id},process.env.ACCESS_TOKEN as string,{expiresIn:"5m"});
            const refreshToken=jwt.sign({id:user._id},process.env.REFRESH_TOKEN as string,{expiresIn:"7d"})
            req.user=user;
            res.cookie('access_token', accessToken, accessTokenOptions);
            res.cookie('refresh_token', refreshToken, refreshTokenOptions);
            // await redis.set(user._id,JSON.stringify(user),"EX",604800)
          return res.status(200).json({
            success:true,
            accessToken,
        })}
        catch(err:any)
        {
            return next(new ErrorHandler(err.message,400))
        }
}
)

//get user info
export const getUserInfo = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user?._id || '';
    const user = await getUserById(userId);
    if (!user) {
      return next(new ErrorHandler("User not found", 404));
    }
    res.status(200).json({
      success: true,
      user
    });
  }
);

// social auth
interface ISocialAuthBody {
  email: string;
  name: string;
  avatar: {
    public_id: string;
    url: string;
  };
}

export const socialAuth = CatchAsyncError(
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const { email, name, avatar } = req.body as ISocialAuthBody;
      const user = await userModel.findOne({ email });

      if (!user) {
        const newUser = await userModel.create({ email, name, avatar });
        sendToken(newUser, 200, res);
      } else {
        sendToken(user, 200, res);
      }
    } catch (error: any) {
      return next(new ErrorHandler(error.message, 400));
    }
  }
);

