import express from 'express';
import { AcademicSemesterControllers } from './academicSemester.controllers';
import validateRequest from '../../middlewares/validateRequest';
import { academicSemesterValidation } from './academicSemester.validation';
import { USER_ROLE } from '../user/user.constant';
import auth from '../../middlewares/auth';

const router = express.Router();

router.post('/create-academic-semester',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(academicSemesterValidation.createAcademicSemesterValidationSchema),AcademicSemesterControllers.createAcademicSemester
  
);
router.get(
  '/:semesterId',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),
  AcademicSemesterControllers.getSingleAcademicSemester,
);

router.patch(
  '/:semesterId',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(
    academicSemesterValidation.updateAcademicSemesterValidationSchema,
  ),
  AcademicSemesterControllers.updateAcademicSemester,
);

router.get('/',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),
  AcademicSemesterControllers.getAllAcademicSemesters);

export const AcademicSemesterRoutes = router;
