import { NextFunction, Request, Response } from "express";
import catchAsync from "../utils/catchAsync";
import AppError from "../error/AppError";
import { StatusCodes } from "http-status-codes";
import jwt, { JwtPayload } from 'jsonwebtoken';
import { TUserRole } from "../modules/user/user.interface";

const auth = (...requiredRoles: TUserRole[])=>{
  return catchAsync(
    async(req:Request,res:Response,next:NextFunction)=>{
    const token = req.headers.authorization;
    if(!token){
      throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
    }

    jwt.verify(token,process.env.JWT_ACCESS_SECRET as string , function(err, decoded) {
     if(err){
      throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
     }
    const role = (decoded as JwtPayload).role;
    if(requiredRoles && !requiredRoles.includes(role)){
      throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
    }


    req.user = decoded as JwtPayload;
    next();
    });

     
    }
  )
}

export default auth;