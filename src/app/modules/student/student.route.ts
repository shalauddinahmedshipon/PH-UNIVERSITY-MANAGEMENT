import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';

const router = express.Router();

router.get('/', StudentController.getAllStudent);
router.get('/:id',auth("admin","faculty") ,StudentController.getSingleStudent);
router.patch('/:id',auth("admin"),validateRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent);
router.delete('/:id',auth("admin"), StudentController.deleteStudent);

export const StudentRoutes = router;
