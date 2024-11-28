import { NextFunction, Request, Response } from 'express';
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';




const createStudent = async (req: Request, res: Response,next:NextFunction) => {
  
  try {

    const {password, student: studentData } = req.body;
    // const zodParseData = studentSchema.parse(studentData);
    const result = await UserServices.createStudentIntoDB(password,studentData);
    console.log(studentData);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:' Student Created successfully',
      data:result
    })
  } catch (err) {
   next(err)
  }
};


export const UserController = {
  createStudent
 
};
