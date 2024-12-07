import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
const router = express.Router();
router.get('/', StudentController.getAllStudent);
router.get('/:studentID', StudentController.getSingleStudent);
router.patch('/:studentID',validateRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent);
router.delete('/:studentID', StudentController.deleteStudent);

export const StudentRoutes = router;
