/* eslint-disable @typescript-eslint/no-unused-vars */
import mongoose from 'mongoose';
import {Student } from './student.model';
import AppError from '../../error/AppError';
import { StatusCodes } from 'http-status-codes';
import { User } from '../user/user.model';
import { TStudent } from './student.interface';
import QueryBuilder from '../../builders/QueryBuilder';
import { studentSearchableField } from './student.constant';


const getAllStudentFromDB = async (query:Record<string,unknown>) => {
const studentQuery = new QueryBuilder(Student.find()
.populate('user')
.populate({
    path:'academicDepartment',
    populate:{
      path:'academicFaculty'
    }
  }).populate('admissionSemester')
,query)
.search(studentSearchableField)
.filter()
.sort()
.paginate()
.fields();

const result = await studentQuery.modelQuery;
const meta =await studentQuery.countTotal();

return {meta, result }

};



const getSingleStudentFromDB = async (id: string) => {
 
  const result = await Student.findById(id).populate({
    path:'academicDepartment',
    populate:{
      path:'academicFaculty'
    }
  }).populate('admissionSemester');
  return result;
};

const updateStudentIntoDB = async (id: string,payload:Partial<TStudent>) => {
   const {name,guardian,localGuardian,...remainingStudentData} = payload; 
   
  const modifiedUpdatedData:Record<string,unknown> = {
    ...remainingStudentData
  } 
  if(name && Object.keys(name).length){
    for(const [key,value] of Object.entries(name)){
      modifiedUpdatedData[`name.${key}`] = value;
    }
  } 
  if(guardian && Object.keys(guardian).length){
    for(const [key,value] of Object.entries(guardian)){
      modifiedUpdatedData[`guardian.${key}`] = value;
    }
  } 
  if(localGuardian && Object.keys(localGuardian).length){
    for(const [key,value] of Object.entries(localGuardian)){
      modifiedUpdatedData[`localGuardian.${key}`] = value;
    }
  } 
  const result = await Student.findByIdAndUpdate(id,modifiedUpdatedData,
  {new:true,runValidators:true}
  )
  return result;
};



const deleteStudentFromDB = async (id: string) => {
  const session = await mongoose.startSession();
  try {
    session.startTransaction();
    const deletedStudent = await Student.findByIdAndUpdate( id ,{isDeleted:true},
    {new:true, session}
    );
    if(!deletedStudent){
      throw new AppError(StatusCodes.BAD_REQUEST,'Failed to delete student')
    }
    // get user _id from deletedStudent
    const userId = deletedStudent.user;
    const deletedUser = await User.findByIdAndUpdate(userId,{isDeleted:true},
    {new:true, session}
    );
    if(!deletedUser){
      throw new AppError(StatusCodes.BAD_REQUEST,'Failed to delete user')
    }
    await session.commitTransaction();
    await session.endSession();
    return deletedStudent; 
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error('Failed to delete user')

  }

};

export const StudentServices = {
  getAllStudentFromDB,
  getSingleStudentFromDB,
  updateStudentIntoDB,
  deleteStudentFromDB
};
