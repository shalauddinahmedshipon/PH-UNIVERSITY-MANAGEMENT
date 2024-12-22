import { Model } from "mongoose";
import { USER_ROLE } from "./user.constant";

export interface IUser {
  id:string;
  password:string;
  needsPasswordChange:boolean;
  passwordChangedAt?:Date;
  status:'in-progress'|'blocked';
  role:'admin'|'student'|'faculty';
  isDeleted:boolean
};

export interface UserModel extends Model<IUser> { 
  isUserExistsByCustomId(id:string):Promise<IUser>;
  isPasswordMatched(plainTextPassword:string,hashedPassword:string):Promise<boolean>
  isJWTIssuedBeforePasswordChanged(passwordChangedTimestamp:Date,
    jwtIssuedTimestamp:number
  ):boolean;
}

export type TUserRole = keyof typeof USER_ROLE ;