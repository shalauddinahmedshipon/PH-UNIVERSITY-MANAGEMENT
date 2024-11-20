import { Request, Response } from 'express';
import { StudentServices } from './student.service';

const createStudent = async (req: Request, res: Response) => {
  try {
    const { student: studentData } = req.body;
    const result = await StudentServices.createStudentIntoDB(studentData);
    console.log(studentData);
    res.status(200).json({
      success: true,
      message: 'create student successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};

const getSingleStudent = async (req: Request, res: Response) => {
  try {
    const { studentID } = req.params;
    const result = await StudentServices.getSingleStudentFromDB(studentID);
    res.status(200).json({
      success: true,
      message: 'get single student successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
const getAllStudent = async (req: Request, res: Response) => {
  try {
    const result = await StudentServices.getAllStudentFromDB();
    res.status(200).json({
      success: true,
      message: 'create student successfully',
      data: result,
    });
  } catch (error) {
    console.log(error);
  }
};
export const StudentController = {
  createStudent,
  getAllStudent,
  getSingleStudent,
};
