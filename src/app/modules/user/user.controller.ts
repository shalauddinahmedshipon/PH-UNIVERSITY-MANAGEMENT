
import { UserServices } from './user.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';




const createStudent = catchAsync(
  async (req, res) => {
    const {password, student: studentData } = req.body;
    const result = await UserServices.createStudentIntoDB(password,studentData);
    console.log(studentData);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:' Student Created successfully',
      data:result
    })
   
  }
);


export const UserController = {
  createStudent
 
};
