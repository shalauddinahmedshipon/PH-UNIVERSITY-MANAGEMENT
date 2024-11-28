import { NextFunction, Request, Response } from 'express';
import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';

const getSingleStudent = async (req: Request, res: Response ,next:NextFunction) => {
  try {
    const { studentID } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentID);

    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Student Retrieve  successfully',
      data:result
    })
    
  } catch (err) {
   next(err);
  }
};
const deleteStudent = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const { studentID } = req.params;
    const result = await StudentServices.deleteStudentFromDB(studentID);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Student deleted successfully',
      data:result
    })
  } catch (err) {
  next(err);
  }
};
const getAllStudent = async (req: Request, res: Response,next:NextFunction) => {
  try {
    const result = await StudentServices.getAllStudentFromDB();
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'All Student Retrieve successfully',
      data:result
    })
    
  } catch (err) {
   next(err);
  }
};

export const StudentController = {

  getAllStudent,
  getSingleStudent,
  deleteStudent
};
