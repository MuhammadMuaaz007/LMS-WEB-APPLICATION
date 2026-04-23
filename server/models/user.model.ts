import mongoose from "mongoose";
import bcrypt from "bcryptjs";
import { Document, Schema, Model } from "mongoose";
import jwt from "jsonwebtoken";
// import { CallbackWithoutResultAndOptionalError } from 'mongoose';
import dotenv from "dotenv";
dotenv.config();



const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export interface IUser extends Document{
  name:string;
  email:string;
  password:string;
  avatar:{
    public_id:string;
    url:string;
  },
  role:string;
  isVerified:boolean;
  courses:Array<{courseId:string}>;
  comparePassword:(password:string)=>Promise<boolean>;  
  SignAccessToken:()=>string;
  SignRefreshToken:()=>string;
}

const userSchema: Schema<IUser>= new mongoose.Schema({
  name:{
    type:String,
    required:[true,"Please enter your name"],
  },
  email: {
    type: String,
    required: [true, "Please enter your email"],
    validate: {
      validator: function (value: string) {
        return emailRegexPattern.test(value);
      },
      message: "please enter a valid email",
    },
    unique: true,
  },
  password: {
    type: String,
    required: [true, "Please enter your password"],
    minlength: [6, "Password must be at least 6 characters"],
    select: false,
  },
  avatar: {
    public_id: String,
    url: String,
  },
  role: {
    type: String,
    default: "user",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  courses: [
    {
      courseId: String,
    }
  ],
}, { timestamps: true });

// Hash password before saving to database
userSchema.pre<IUser>("save", async function () {
  if (!this.isModified("password")) {
    return;
  }
  this.password = await bcrypt.hash(this.password, 10);
});

// sign access token
userSchema.methods.SignAccessToken=function (){
  return jwt.sign({id:this._id},process.env.ACCESS_TOKEN || '')
}
// sign refresh token
userSchema.methods.SignRefreshToken=function (){
  return jwt.sign({id:this._id},process.env.REFRESH_TOKEN || '')
}
// Compare Password
userSchema.methods.comparePassword = async function (enteredPassword: string): Promise<boolean> {
    return await bcrypt.compare(enteredPassword, this.password);
};

const userModel: Model<IUser> = mongoose.model("User", userSchema);
export default userModel;