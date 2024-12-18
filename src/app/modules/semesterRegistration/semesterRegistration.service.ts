import { StatusCodes } from "http-status-codes";
import AppError from "../../error/AppError";
import { TSemesterRegistration } from "./semesterRegistration.interface";

import { AcademicSemester } from "../academicSemester/academicSemester.mode";
import QueryBuilder from "../../builders/QueryBuilder";
import { registrationStatus } from "./semesterRegistration.constant";
import { SemesterRegistration } from "./semesterRegistration.model";

const createSemesterRegistrationIntoDB = async(payload:TSemesterRegistration)=>{
const academicSemester = payload?.academicSemester;

//check if there any registered semester this is already 'UPCOMING' OR 'ONGOING'
const isThereAnyUpcomingOrOngoingSemester=await SemesterRegistration.findOne({
  $or:[{status:registrationStatus.UPCOMING},{status:registrationStatus.ONGOING}]
});
if(isThereAnyUpcomingOrOngoingSemester){
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `There is already an ${isThereAnyUpcomingOrOngoingSemester.status} register semester`
  )
}

const isAcademicSemesterIsExist= await AcademicSemester.findById(academicSemester);
if(!isAcademicSemesterIsExist){
  throw new AppError(StatusCodes.NOT_FOUND,"Academic semester is not found");
}
const isSemesterRegistrationExist = await SemesterRegistration.findOne({academicSemester});
if(isSemesterRegistrationExist){
  throw new AppError(StatusCodes.CONFLICT,"semester registration is already exist");
}

const result = await SemesterRegistration.create(payload);
return result;
};


const getAllSemesterRegistrationsFromDB = async (query:Record<string,unknown>) => {
  const semesterRegistrationQuery = new QueryBuilder(SemesterRegistration.find().populate('academicSemester'),query)
  .filter()
  .sort()
  .paginate()
  .fields();
  const result = await semesterRegistrationQuery.modelQuery;
  return result;
};

const getSingleSemesterRegistrationFromDB = async (id: string) => {
  const result = await SemesterRegistration.findById(id).populate('academicSemester');
  return result;
};

const updateSemesterRegistrationIntoDB = async (
  id: string,
  payload: Partial<TSemesterRegistration>,
) => {
  //check if the requested registered semester is exist
  const isSemesterRegistrationExist = await SemesterRegistration.findById(id);
  if(!isSemesterRegistrationExist){
    throw new AppError(StatusCodes.NOT_FOUND,"semester registration is not found");
  }

  //if the requested semester registration is ended, we will not update anything
  const requestedStatus = payload?.status;
  const currentSemesterStatus = isSemesterRegistrationExist?.status;
  if(currentSemesterStatus===registrationStatus.ENDED){
    throw new AppError(
      StatusCodes.BAD_REQUEST,
      `This semester is already ${currentSemesterStatus}`
    )
  } 

  //UPCOMING-->ONGOING-->ENDED
if(currentSemesterStatus===registrationStatus.UPCOMING&& requestedStatus===registrationStatus.ENDED){
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`
  )
}
if(currentSemesterStatus===registrationStatus.ONGOING&& requestedStatus===registrationStatus.UPCOMING){
  throw new AppError(
    StatusCodes.BAD_REQUEST,
    `You can not directly change status from ${currentSemesterStatus} to ${requestedStatus}`
  )
}
const result = await SemesterRegistration.findByIdAndUpdate(id,payload,{new:true,runValidators:true})
  return result;
};



export const SemesterRegistrationServices ={

  createSemesterRegistrationIntoDB,
  getAllSemesterRegistrationsFromDB,
  getSingleSemesterRegistrationFromDB,
  updateSemesterRegistrationIntoDB
}