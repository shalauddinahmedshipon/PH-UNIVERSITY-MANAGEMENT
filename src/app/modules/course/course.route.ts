import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';


const router = express.Router();

router.post('/create-course',auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(CourseValidations.createCourseValidationSchema),CourseControllers.createCourse
);
router.get(
  '/:id',auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),
CourseControllers.getSingleCourse
);
router.delete(
  '/:id',auth(USER_ROLE.superAdmin,USER_ROLE.admin),
CourseControllers.deleteCourse
);
router.put(
  '/:courseId/assign-faculties',auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
CourseControllers.assignFacultiesWithCourse
);
router.delete(
  '/:courseId/remove-faculties',auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse
);

router.patch(
  '/:id',auth(USER_ROLE.superAdmin,USER_ROLE.admin),
  validateRequest(
 CourseValidations.updateCourseValidationSchema
  ),
CourseControllers.updateCourse
);

router.get('/',auth(USER_ROLE.superAdmin,USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student), CourseControllers.getAllCourses);

export const courseRoutes = router;
