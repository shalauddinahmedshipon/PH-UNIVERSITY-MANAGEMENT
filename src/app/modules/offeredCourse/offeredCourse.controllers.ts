import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { OfferedCourseServices } from './offeredCourse.service';

const createOfferedCourse = catchAsync(
  async (req, res) => {
    const result = await OfferedCourseServices.createOfferedCourseIntoDB(req.body);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'OfferedCourse Created successfully',
      data:result
    })
   
  }
);


const getAllOfferedCourses = catchAsync(async (req, res) => {
  const result = await OfferedCourseServices.getAllOfferedCoursesFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All OfferedCourses are retrieved successfully',
    data: result,
  });
});

const getMyOfferedCourses = catchAsync(async (req, res) => {
  const userId= req.user.userId;

  const result = await OfferedCourseServices.getMyOfferedCoursesFromDB(userId,req.query)

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'My OfferedCourses are retrieved successfully',
    data: result,
  });
});

const getSingleOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await OfferedCourseServices.getSingleOfferedCourseFromDB(id);
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Single OfferedCourse is retrieved successfully',
    data: result,
  });
});

const updateOfferedCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await OfferedCourseServices.updateOfferedCourseIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'OfferedCourse updated successfully',
    data: result,
  });
});


export const OfferedCourseControllers = {
  createOfferedCourse,
  getAllOfferedCourses,
  getSingleOfferedCourse,
  updateOfferedCourse,
  getMyOfferedCourses
};
