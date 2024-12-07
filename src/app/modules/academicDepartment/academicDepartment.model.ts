import { model, Schema } from "mongoose";
import { TAcademicDepartment } from "./academicDepartment.interface";
import AppError from "../../error/AppError";
import { StatusCodes } from "http-status-codes";


const AcademicDepartmentSchema = new Schema<TAcademicDepartment>({
  name:{
    type:String,
    required:true,
    unique:true
  },
  academicFaculty:{
    type: Schema.Types.ObjectId,
    ref:'AcademicFaculty'
  }
},
{
  timestamps:true
}
)




AcademicDepartmentSchema.pre('save', async function(next){
  const isDepartmentExist = await AcademicDepartment.findOne({name:this.name})
  if(isDepartmentExist){
    throw new AppError(StatusCodes.NOT_FOUND,'Academic Department is Already exist!')
  }
  next();
})

AcademicDepartmentSchema.pre('findOneAndUpdate', async function(next){
  const query = this.getQuery();
  const isDepartmentExist = await AcademicDepartment.findOne(query);
  if(!isDepartmentExist){
    throw new AppError(StatusCodes.NOT_FOUND,'Academic Department does not exist!')
  }
  next();
})

export const AcademicDepartment = model<TAcademicDepartment>('AcademicDepartment',AcademicDepartmentSchema);