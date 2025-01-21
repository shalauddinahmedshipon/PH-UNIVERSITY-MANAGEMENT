import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { EnrolledCourseServices } from "./enrolledCourse.service";

const createEnrolledCourse = catchAsync(
  async (req, res) => {
    const userId=req.user.userId;
    const payload= req.body;
    const result = await EnrolledCourseServices.createEnrolledCourseIntoDB(userId,payload);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Enrolled Course Created successfully',
      data:result
    })
   
  }
);
const updateEnrolledCourseMarks = catchAsync(
  async (req, res) => {
const facultyId = req.user.userId
const result = await EnrolledCourseServices.updateEnrolledCourseMarksIntoDB(facultyId, req.body);    
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Enrolled Course Updated successfully',
      data:result
    })
   
  }
);

export const EnrolledCourseControllers={
  createEnrolledCourse , updateEnrolledCourseMarks
}
