import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';
import { SemesterRegistrationServices } from './semesterRegistration.service';



const createSemesterRegistration = catchAsync(
  async (req, res) => {
    const result = await SemesterRegistrationServices.createSemesterRegistrationIntoDB(req.body);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'semester registration Created successfully',
      data:result
    })
   
  }
);


const getAllSemesterRegistrations = catchAsync(async (req, res) => {
  const result = await SemesterRegistrationServices.getAllSemesterRegistrationsFromDB(req.query);

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'All Semester Registrations are retrieved successfully',
    data: result,
  });
});

const getSingleSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result =
    await SemesterRegistrationServices.getSingleSemesterRegistrationFromDB(id);
    sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Single Semester Registration is retrieved successfully',
    data: result,
  });
});

const updateSemesterRegistration = catchAsync(async (req, res) => {
  const { id } = req.params;
  const result = await SemesterRegistrationServices.updateSemesterRegistrationIntoDB(
    id,
    req.body,
  );

  sendResponse(res, {
    statusCode: StatusCodes.OK,
    success: true,
    message: 'Semester registration updated successfully',
    data: result,
  });
});


export const SemesterRegistrationControllers = {
  createSemesterRegistration,
  getAllSemesterRegistrations,
  getSingleSemesterRegistration,
  updateSemesterRegistration
 
};
