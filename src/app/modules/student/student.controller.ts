import { StudentServices } from './student.service';
import sendResponse from '../../utils/sendResponse';
import { StatusCodes } from 'http-status-codes';
import catchAsync from '../../utils/catchAsync';


const getSingleStudent =catchAsync(
  async (req, res) => {  
    const { id } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(id);

    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Student Retrieve  successfully',
      data:result
    })
  }
)


const updateStudent =catchAsync(
  async (req, res) => {
    const { id } = req.params;
    const {student} = req.body;
    const result = await StudentServices.updateStudentIntoDB(id,student);

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
    const { id } = req.params;
      const result = await StudentServices.deleteStudentFromDB(id);
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
    // console.log("base query",req.query);
    const result = await StudentServices.getAllStudentFromDB(req.query);
   
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
  deleteStudent,
  updateStudent
};
