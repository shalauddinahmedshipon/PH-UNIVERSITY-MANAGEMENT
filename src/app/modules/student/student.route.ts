import express from 'express';
import { StudentController } from './student.controller';
import validateRequest from '../../middlewares/validateRequest';
import { studentValidations } from './student.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.get('/',
  auth(USER_ROLE.admin,USER_ROLE.superAdmin),
  StudentController.getAllStudent);
router.get('/:id',  auth(USER_ROLE.admin,USER_ROLE.superAdmin,USER_ROLE.faculty),StudentController.getSingleStudent);
router.patch('/:id',  auth(USER_ROLE.admin,USER_ROLE.superAdmin),validateRequest(studentValidations.updateStudentValidationSchema), StudentController.updateStudent);
router.delete('/:id',auth(USER_ROLE.admin,USER_ROLE.superAdmin), StudentController.deleteStudent);

export const StudentRoutes = router;
