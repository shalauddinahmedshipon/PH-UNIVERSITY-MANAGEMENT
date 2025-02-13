/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from "../modules/user/user.interface";
import { User } from "../modules/user/user.model";

const auth = (...requiredRoles: TUserRole[])=>{
  return catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization;
    if(!token){
      throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
    }

  let decoded;
  try {
  decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET as string )as JwtPayload;
  } catch (err) {
    throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
  }
   const {userId,iat,role} = decoded;

  // checking if the user is exist 
const user =await User.isUserExistsByCustomId(userId);

if(!user){
  throw new AppError(StatusCodes.NOT_FOUND,
    'this user is not found'
  )
}
// //checking if the user is already deleted
const isDeleted = user?.isDeleted;
if(isDeleted){
  throw new AppError(StatusCodes.FORBIDDEN,
    'this user is already deleted'
  )
}
// //checking if the user is blocked
const userStatus = user?.status;
if(userStatus==='blocked'){
  throw new AppError(StatusCodes.FORBIDDEN,
    'this user is blocked!'
  )
}

if(user.passwordChangedAt&&User.isJWTIssuedBeforePasswordChanged(
  user.passwordChangedAt,
  iat as number
)){
  throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
}

    if(requiredRoles && !requiredRoles.includes(role)){
      throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
    }


    req.user = decoded as JwtPayload;
    next();
    }); 

}

export default auth;