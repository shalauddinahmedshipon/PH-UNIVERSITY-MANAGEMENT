import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { CourseValidations } from './course.validation';
import { CourseControllers } from './course.controller';
import auth from '../../middlewares/auth';


const router = express.Router();

router.post('/create-course',auth('admin'),
  validateRequest(CourseValidations.createCourseValidationSchema),CourseControllers.createCourse
);
router.get(
  '/:id',auth('admin','faculty','student'),
CourseControllers.getSingleCourse
);
router.delete(
  '/:id',auth('admin'),
CourseControllers.deleteCourse
);
router.put(
  '/:courseId/assign-faculties',
  validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
CourseControllers.assignFacultiesWithCourse
);
router.delete(
  '/:courseId/remove-faculties',
  validateRequest(CourseValidations.FacultiesWithCourseValidationSchema),
  CourseControllers.removeFacultiesWithCourse
);

router.patch(
  '/:id',auth('admin'),
  validateRequest(
 CourseValidations.updateCourseValidationSchema
  ),
CourseControllers.updateCourse
);

router.get('/',auth('admin','faculty','student'), CourseControllers.getAllCourses);

export const courseRoutes = router;
