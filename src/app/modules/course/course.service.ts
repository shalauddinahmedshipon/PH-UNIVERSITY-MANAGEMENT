
import mongoose from "mongoose";
import QueryBuilder from "../../builders/QueryBuilder";
import { courseSearchableFields } from "./course.constant";
import { TCourse } from "./course.interface";
import { Course, CourseFaculty } from "./course.model";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";



const createCourseIntoDB = async(payload:TCourse)=>{
const result = await Course.create(payload);
return result;
};
const getAllCoursesFromDB = async (query:Record<string,unknown>) => {
  const courseQuery =new QueryBuilder(Course.find()
  .populate('preRequisiteCourses.course')
  ,query)
  .search(courseSearchableFields)
  .filter()
  .sort()
  .paginate()
  .fields()
  const result = await courseQuery.modelQuery ;
  const meta =await courseQuery.countTotal();

return {meta, result }

};

const getSingleCourseFromDB = async (id: string) => {
  const result = await Course.findById(id).populate('preRequisiteCourses.course');
  return result;
};
 
const updateCourseIntoDB = async(id:string,payload:Partial<TCourse>)=>{
  const {preRequisiteCourses,...courseRemainingData} = payload;
  const session= await mongoose.startSession();

  try {
  session.startTransaction();
  const updatedBasicCourseInfo = await Course.findByIdAndUpdate(id,courseRemainingData,{
    new:true,
    runValidators:true,
    session
  })
  if(!updatedBasicCourseInfo){
    throw new AppError(StatusCodes.BAD_REQUEST,"Failed to update course")
  }
 
  if(preRequisiteCourses&&preRequisiteCourses.length>0){
   const deletedPreRequisites = preRequisiteCourses.filter(el=>el.course&&el.isDeleted).map(el=>el.course);
  
        const deletedPreRequisitesCourses = await Course.findByIdAndUpdate(id,{
          $pull:{preRequisiteCourses:{course:{$in:deletedPreRequisites}}},
        },{
          new:true,
          runValidators:true,
          session
        })

        if(!deletedPreRequisitesCourses){
          throw new AppError(StatusCodes.BAD_REQUEST,"Failed to update course")
        }

        const newPreRequisites = preRequisiteCourses?.filter(
          (el)=>el.course && !el.isDeleted
        )

        const newPreRequisitesCourses= await Course.findByIdAndUpdate(id,{
          $addToSet:{preRequisiteCourses:{$each:newPreRequisites}},
        },{
          new:true,
          runValidators:true,
          session
        })

        if(!newPreRequisitesCourses){
          throw new AppError(StatusCodes.BAD_REQUEST,"Failed to update course")
        }
        const result = await Course.findById(id).populate('preRequisiteCourses.course')

        return result;
  } 
  await session.commitTransaction();
  await session.endSession();
 
  } catch (error) {
    await session.abortTransaction();
    await session.endSession();
    throw new AppError(StatusCodes.BAD_REQUEST,"Failed to update course")
  }
 
  

  
}

const deleteCourseFromDB = async(id:string)=>{
  const result = await Course.findByIdAndUpdate(id,{isDeleted:true},{new:true});
  return result
}
const assignFacultiesWithCourseIntoDB = async(id:string,payload:Partial<TCourse>)=>{
  const result = await CourseFaculty.findByIdAndUpdate(id,{
    course:id,
    $addToSet:{faculties:{$each:payload}}
  },{new:true,upsert:true});

  return result
}
const removeFacultiesWithCourseFromDB = async(id:string,payload:Partial<TCourse>)=>{
  const result = await CourseFaculty.findByIdAndUpdate(id,{
  
    $pull:{faculties:{$in:payload}}
  },{new:true});

  return result
}


export const CourseServices ={

  createCourseIntoDB,
  getAllCoursesFromDB,
  getSingleCourseFromDB,
  updateCourseIntoDB,
  deleteCourseFromDB,
  assignFacultiesWithCourseIntoDB,
  removeFacultiesWithCourseFromDB
}