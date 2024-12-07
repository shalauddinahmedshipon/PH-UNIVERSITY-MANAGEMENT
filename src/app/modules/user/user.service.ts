import config from "../../config";
import { TStudent } from "../student/student.interface";
import { TUser } from "./user.interface";
import {  User } from "./user.model";
import { Student } from "../student/student.model";
import { AcademicSemester } from "../academicSemester/academicSemester.mode";
import { generateStudentId } from "./user.utils";
import mongoose from "mongoose";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";

const createStudentIntoDB = async (password:string , payload:TStudent) => {
//  create a user object 
const userData:Partial<TUser> = {};


  //if password is not given, use default password
  userData.password = password || (config.default_password as string)
 

  //set student role
  userData.role = 'student'


 

const admissionSemester= await AcademicSemester.findById(payload.admissionSemester);

const session = await mongoose.startSession();

 try {
  session.startTransaction();
  userData.id =await generateStudentId(admissionSemester);

  // create a user (transaction -1)
  const newUser = await User.create([userData],{session}); 

  // create a student 
  if(!newUser.length){
   throw new AppError(StatusCodes.BAD_REQUEST,'Failed to create user')
  }
 
  // set id, _id as user 
  payload.id = newUser[0].id;
  payload.user = newUser[0]._id

  // create a student (transaction -2)
  const newStudent = await Student.create([payload],{session});

  if(!newStudent.length){
    throw new AppError(StatusCodes.BAD_REQUEST,'Failed to create student')
   }

   await session.commitTransaction();
   await session.endSession();

  return newStudent


 } catch (error) {
  await session.abortTransaction();
  await session.endSession();
  throw new Error('Failed to create user')
 }
  

 
};



export const UserServices = {
  createStudentIntoDB
 
};
