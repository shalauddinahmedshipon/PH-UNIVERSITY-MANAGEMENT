import { Model } from "mongoose";

export interface IUser {
  id:string;
  password:string;
  needsPasswordChange:boolean;
  status:'in-progress'|'blocked';
  role:'admin'|'student'|'faculty';
  isDeleted:boolean
};

export interface UserModel extends Model<IUser> {
  // myStaticMethod(): number;
  isUserExistsByCustomId(id:string):Promise<IUser>;
  isPasswordMatched(plainTextPassword:string,hashedPassword:string):Promise<boolean>
}
