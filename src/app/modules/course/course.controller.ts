import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { CourseServices } from './course.service';


const createCourse = catchAsync(
  async (req, res) => {
    const result = await CourseServices.createCourseIntoDB(req.body);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Course Created successfully',
      data:result
    })
   
  }
);


const getAllCourses = catchAsync(async (req, res) => {
  const result = await CourseServices.getAllCoursesFromDB(req.params);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Courses are retrieved successfully',
    meta:result.meta,
    data:result.result,
  });
});

const getSingleCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await CourseServices.getSingleCourseFromDB(id);
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Course is retrieved successfully',
    data: result,
  });
});

const deleteCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.deleteCourseFromDB(
       id
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Course is deleted successfully',
    data: result,
  });
});

const updateCourse = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await CourseServices.updateCourseIntoDB(
   id,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Update course successfully',
    data: result,
  });
});
const assignFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body;
  const result = await CourseServices.assignFacultiesWithCourseIntoDB(
    courseId,
    faculties
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'assign faculties with course successfully',
    data: result,
  });
});

const getFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const result =
    await CourseServices.getFacultiesWithCourseFromDB(courseId);
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'faculties with course is retrieved successfully',
    data: result,
  });
});
const removeFacultiesWithCourse = catchAsync(async (req, res) => {
  const { courseId } = req.params;
  const {faculties} = req.body;
  const result = await CourseServices.removeFacultiesWithCourseFromDB(
    courseId,
    faculties
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'assign faculties with course successfully',
    data: result,
  });
});


export const CourseControllers = {
  createCourse,
  getAllCourses,
  getSingleCourse,
  updateCourse,
  deleteCourse,
  assignFacultiesWithCourse,
  getFacultiesWithCourse,
  removeFacultiesWithCourse
 
};
