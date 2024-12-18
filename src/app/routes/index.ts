import { Router } from "express";
import { StudentRoutes } from "../modules/student/student.route";
import { UserRoutes } from "../modules/user/user.route";
import { AcademicSemesterRoutes } from "../modules/academicSemester/academicSemester.route";
import { AcademicFacultyRoutes } from "../modules/academicFaculty/academicFaculty.route";
import { AcademicDepartmentRoutes } from "../modules/academicDepartment/academicDepartment.route";
import { FacultyRoutes } from "../modules/faculty/faculty.route";
import { AdminRoutes } from "../modules/admin/admin.route";
import { courseRoutes } from "../modules/course/course.route";
import { SemesterRegistrationRoutes } from "../modules/semesterRegistration/semesterRegistration.route";
import { OfferedCourseRoutes } from "../modules/offeredCourse/offeredCourse.route";

const router = Router();

const moduleRoutes =[
  
  {
    path:'/users',
    route:UserRoutes
  },
 
  {
    path: '/admins',
    route: AdminRoutes,
  },
  {
    path: '/faculties',
    route: FacultyRoutes,
  },
  {
    path:'/students',
    route:StudentRoutes
  },
  {
    path:'/academic-semesters',
    route:AcademicSemesterRoutes
  },
  {
    path:'/academic-faculties',
    route:AcademicFacultyRoutes
  },
  {
    path:'/academic-departments',
    route:AcademicDepartmentRoutes
  },
  {
    path:'/semester-registrations',
    route:SemesterRegistrationRoutes
  },
  {
    path:'/courses',
    route:courseRoutes
  },
  {
    path:'/offered-courses',
    route:OfferedCourseRoutes
  },
]

moduleRoutes.forEach((route)=>router.use(route.path , route.route))



export default router;