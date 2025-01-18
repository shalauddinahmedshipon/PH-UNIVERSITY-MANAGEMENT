/* eslint-disable @typescript-eslint/no-explicit-any */
import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import OfferedCourse from "../offeredCourse/offeredCourse.model";
import { TEnrolledCourse } from "./enrolledCourse.interface";
import { Student } from "../student/student.model";
import { EnrolledCourse } from "./enrolledCourse.model";
import mongoose from "mongoose";

const createEnrolledCourseIntoDB=async(
userId:string,payload:TEnrolledCourse
)=>{
const {offeredCourse}= payload;
const isOfferedCourseExists= await OfferedCourse.findById(offeredCourse);
if(!isOfferedCourseExists){
  throw new AppError(StatusCodes.NOT_FOUND,"offered course is not found!")
}

const student = await Student.findOne({id:userId}).select('id');


if(isOfferedCourseExists.maxCapacity<=0){
  throw new AppError(StatusCodes.BAD_GATEWAY,'Room is full!')
}

if(!student){
  throw new AppError(StatusCodes.NOT_FOUND,"student is not found!")
}

const isStudentAlreadyEnrolled= await EnrolledCourse.findOne(
  {
    semesterRegistration:isOfferedCourseExists?.semesterRegistration,
    offeredCourse,
    student:student._id
  }
)

if(isStudentAlreadyEnrolled){
  throw new AppError(StatusCodes.CONFLICT,"student is already enrolled!")
}

const session = await mongoose.startSession();

  try {
    session.startTransaction();

const result = await EnrolledCourse.create(
  [
    {
      semesterRegistration:isOfferedCourseExists.semesterRegistration,
      academicSemester:isOfferedCourseExists.academicSemester,
      academicFaculty:isOfferedCourseExists.academicFaculty,
      academicDepartment:isOfferedCourseExists.academicDepartment,
      offeredCourse:offeredCourse,
      course:isOfferedCourseExists.course,
      student:student._id,
      faculty:isOfferedCourseExists.faculty,
      isEnrolled:true
  
  }
  ],  { session }
)


if(!result){
  throw new AppError(StatusCodes.BAD_REQUEST,"Failed to enrolled in this course!")
}

const maxCapacity= isOfferedCourseExists.maxCapacity;
await OfferedCourse.findByIdAndUpdate(offeredCourse,{
  maxCapacity:maxCapacity-1
})
    await session.commitTransaction();
    await session.endSession();

    return result;
  } catch (err: any) {
    await session.abortTransaction();
    await session.endSession();
    throw new Error(err);
  }
};

export const EnrolledCourseServices={
  createEnrolledCourseIntoDB
}