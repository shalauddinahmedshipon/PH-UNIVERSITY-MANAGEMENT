import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';



const getSingleStudent =catchAsync(
  async (req, res) => {
    const { studentID } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentID);

    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Student Retrieve  successfully',
      data:result
    })
  }
)






const deleteStudent = catchAsync(
  async (req, res) => {
    const { studentID } = req.params;
      const result = await StudentServices.deleteStudentFromDB(studentID);
      sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:'Student deleted successfully',
        data:result
      })
  }
);


const getAllStudent= catchAsync(
  async (req, res) => {
    const result = await StudentServices.getAllStudentFromDB();
      sendResponse(res,{
        statusCode:StatusCodes.OK,
        success:true,
        message:'All Student Retrieve successfully',
        data:result
      })
  }
);

export const StudentController = {

  getAllStudent,
  getSingleStudent,
  deleteStudent
};
