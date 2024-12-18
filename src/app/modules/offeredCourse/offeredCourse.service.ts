import { StatusCodes } from "http-status-codes";
import QueryBuilder from "../../builders/QueryBuilder";
import AppError from "../../error/AppError";
import { SemesterRegistration } from "../semesterRegistration/semesterRegistration.model";
import { TOfferedCourse, TSchedule } from "./offeredCourse.interface";
import OfferedCourse from "./offeredCourse.model";
import { AcademicFaculty } from "../academicFaculty/academicFaculty.model";
import { AcademicDepartment } from "../academicDepartment/academicDepartment.model";
import { Course } from "../course/course.model";
import { Faculty } from "../faculty/faculty.model";
import { hasTimeConflict } from "./offeredCourse.utils";

const createOfferedCourseIntoDB = async(payload:TOfferedCourse)=>{
const { semesterRegistration,academicFaculty,academicDepartment,course, faculty, section,  days,
  startTime,
  endTime

} = payload;  

const isSemesterRegistrationExist=
await SemesterRegistration.findById(semesterRegistration);
if(!isSemesterRegistrationExist){
  throw new AppError(
    StatusCodes.NOT_FOUND,
    'Semester registration is not found!'
  )
}
const academicSemester = isSemesterRegistrationExist.academicSemester;

const isAcademicFacultyExist=
await AcademicFaculty.findById(academicFaculty);
if(!isAcademicFacultyExist){
  throw new AppError(
    StatusCodes.NOT_FOUND,
    'Academic Faculty is not found!'
  )
}
const isAcademicDepartmentExist=
await AcademicDepartment.findById(academicDepartment);
if(!isAcademicDepartmentExist){
  throw new AppError(
    StatusCodes.NOT_FOUND,
    'Academic Department is not found!'
  )
}
const isCourseExist=
await Course.findById(course);
if(!isCourseExist){
  throw new AppError(
    StatusCodes.NOT_FOUND,
    'Course is not found!'
  )
}
const isFacultyExist=
await Faculty.findById(faculty);
if(!isFacultyExist){
  throw new AppError(
    StatusCodes.NOT_FOUND,
    'Faculty is not found!'
  )
}

// check if the department is belong to the faculty 
const isDepartmentBelongToFaculty = await AcademicDepartment.findOne({
  _id:academicDepartment,
  academicFaculty, 
})
if(!isDepartmentBelongToFaculty){
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `This ${isAcademicDepartmentExist.name} is not belong to this ${isAcademicFacultyExist.name}`
  )
}

// check if the same offered course same section in same registered semester exists 
const isSameOfferedCourseExistsWithSameRegisteredSameSection= await OfferedCourse.findOne({
semesterRegistration,
course,
section
})
if(isSameOfferedCourseExistsWithSameRegisteredSameSection){
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `Offered course with same section is already exist!`
  )
}

// get the schedules of the faculties 
const assignedSchedules:TSchedule[] = await OfferedCourse.find({
  semesterRegistration,
  faculty,
  days:{$in:days}
}).select('days startTime endTime');

console.log(assignedSchedules);

const newSchedule ={
  days,
  startTime,
  endTime
}

 if(hasTimeConflict(assignedSchedules,newSchedule)){
  throw new AppError(StatusCodes.CONFLICT,'This faculty is not available at this time !,please choose other time or days')
 };

const result = await OfferedCourse.create({...payload,academicSemester});
return result;
};


const getAllOfferedCoursesFromDB = async (query:Record<string,unknown>) => {
  const OfferedCourseQuery = new QueryBuilder(OfferedCourse.find().populate('academicSemester'),query)
  .filter()
  .sort()
  .paginate()
  .fields();
  const result = await OfferedCourseQuery.modelQuery;
  return result;
};

const getSingleOfferedCourseFromDB = async (id: string) => {
  const result = await OfferedCourse.findById(id).populate('academicSemester');
  return result;
};

const updateOfferedCourseIntoDB = async (
  id: string,
  payload: Pick<TOfferedCourse,'faculty'|'days'|'startTime'|'endTime'>
) => {
  const {faculty, days, startTime,endTime} = payload;

  const isOfferedCourseExist=
  await OfferedCourse.findById(id);
  if(!isOfferedCourseExist){
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Offered Course is not found!'
    )
  }

  const isFacultyExist=
  await Faculty.findById(faculty);
  if(!isFacultyExist){
    throw new AppError(
      StatusCodes.NOT_FOUND,
      'Faculty is not found!'
    )
  }


 const semesterRegistration = isOfferedCourseExist.semesterRegistration; 

 const semesterRegistrationStatus=await SemesterRegistration.findById(semesterRegistration);

 if(semesterRegistrationStatus?.status!=='UPCOMING'){
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `you can not update this Offered Course as it is ${semesterRegistrationStatus?.status}`
  )
 }
// get the schedules of the faculties 
const assignedSchedules:TSchedule[] = await OfferedCourse.find({
  semesterRegistration,
  faculty,
  days:{$in:days}
}).select('days startTime endTime');

console.log(assignedSchedules);

const newSchedule ={
  days,
  startTime,
  endTime
}

 if(hasTimeConflict(assignedSchedules,newSchedule)){
  throw new AppError(StatusCodes.CONFLICT,'This faculty is not available at this time !,please choose other time or days')
 };

const result = await OfferedCourse.findByIdAndUpdate(id,payload,{
  new:true
})
return result;
};



export const OfferedCourseServices ={

  createOfferedCourseIntoDB,
  getAllOfferedCoursesFromDB,
  getSingleOfferedCourseFromDB,
  updateOfferedCourseIntoDB
}