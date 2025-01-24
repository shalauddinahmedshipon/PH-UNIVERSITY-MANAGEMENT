import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { OfferedCourseValidation } from './offeredCourse.validation';
import { OfferedCourseControllers } from './offeredCourse.controllers';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.post('/create-offered-course',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(OfferedCourseValidation.createOfferedCourseValidationSchema),OfferedCourseControllers.createOfferedCourse
);

router.get('/my-offered-courses',
  auth(USER_ROLE.student),
  OfferedCourseControllers.getMyOfferedCourses);

router.get(
  '/:id',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),
OfferedCourseControllers.getSingleOfferedCourse
);

router.patch(
  '/:id',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(
 OfferedCourseValidation.updateOfferedCourseValidationSchema
  ),
OfferedCourseControllers.updateOfferedCourse
);

router.get('/',
  auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.faculty),
  OfferedCourseControllers.getAllOfferedCourses);



export const OfferedCourseRoutes = router;
