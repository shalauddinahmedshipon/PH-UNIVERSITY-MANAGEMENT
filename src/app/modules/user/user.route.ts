import express from 'express';
import { UserController } from './user.controller';
import { studentValidations } from '../student/student.validation';
import validateRequest from '../../middlewares/validateRequest';
import { createFacultyValidationSchema } from '../faculty/faculty.validation';
import { createAdminValidationSchema } from '../admin/admin.validation';
import auth from '../../middlewares/auth';
import { USER_ROLE } from './user.constant';
const router = express.Router();

router.post('/create-student',auth(USER_ROLE.admin),validateRequest(studentValidations.createStudentValidationSchema), UserController.createStudent);
router.post(
  '/create-faculty',
  validateRequest(createFacultyValidationSchema),
  auth(USER_ROLE.admin),
  UserController.createFaculty,
);

router.post(
  '/create-admin',
  validateRequest(createAdminValidationSchema),
  UserController.createAdmin,
);

export const UserRoutes = router;
