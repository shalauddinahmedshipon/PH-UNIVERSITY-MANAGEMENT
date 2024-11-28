import { Schema, model } from 'mongoose';
import {
  
  StudentModel,
  TGuardian,
  TLocalGuardian,
  TStudent,
  TUserName,
} from './student.interface';
import validator from 'validator';



const userNameSchema = new Schema<TUserName>({
  firstName: {
    type: String,
    required: [true, 'First name is required.'],
    maxlength:[20,'first name can not be more than 20 character'],
    trim:true,
    validate:{
      validator:function(value:string){
        const firstNameStr = value.charAt(0).toUpperCase()+value.slice(1);
        return firstNameStr===value;
      },
      message:'{VALUE} is not capitalized format'
    }
  },
  middleName: { type: String },
  lastName: {
    type: String,
    required: [true, 'Last name is required.'],
    validate:{
      validator:(value:string)=>validator.isAlpha(value),
      message:'{VALUE} is should be string'
    }
  },
});

const guardianSchema = new Schema<TGuardian>({
  fatherName: {
    type: String,
    required: [true, 'Father\'s name is required.'],
  },
  fatherOccupation: {
    type: String,
    required: [true, 'Father\'s occupation is required.'],
  },
  fatherContactNo: {
    type: String,
    required: [true, 'Father\'s contact number is required.'],
  },
  motherName: {
    type: String,
    required: [true, 'Mother\'s name is required.'],
  },
  motherOccupation: {
    type: String,
    required: [true, 'Mother\'s occupation is required.'],
  },
  motherContactNo: {
    type: String,
    required: [true, 'Mother\'s contact number is required.'],
  },
});

const localGuardianSchema = new Schema<TLocalGuardian>({
  name: {
    type: String,
    required: [true, 'Local guardian\'s name is required.'],
  },
  address: {
    type: String,
    required: [true, 'Local guardian\'s address is required.'],
  },
  contactNo: {
    type: String,
    required: [true, 'Local guardian\'s contact number is required.'],
  },
});

const studentSchema = new Schema<TStudent,StudentModel>({
  id: {
    type: String,
    required: [true, 'Student ID is required.'],
    unique: true,
  },
  // password: {
  //   type: String,
  //   required: [true, 'Student ID is required.'],
  //   maxlength:[20,'password can not more than 20 character'],

  // },
  user:{
    type:Schema.Types.ObjectId,
    required:[true, 'User id is required.'],
    unique:true,
    ref:'User'
  },
  name: userNameSchema,
  gender: {
    type: String,
    enum: {
      values: ['male', 'female', 'other'],
      message: '{VALUE} is not a valid gender.',
    },
    required: [true, 'Gender is required.'],
  },
  dateOfBirth: { type: String },
  email: {
    type: String,
    required: [true, 'Email address is required.'],
    unique: true,
    validate:{
      validator:(value:string)=>validator.isEmail(value),
      message:'{VALUE} is not a valid email type'
    }
  },
  contactNo: {
    type: String,
    required: [true, 'Contact number is required.'],
  },
  emergencyContactNo: {
    type: String,
    required: [true, 'Emergency contact number is required.'],
  },
  presentAddress: {
    type: String,
    required: [true, 'Present address is required.'],
  },
  permanentAddress: {
    type: String,
    required: [true, 'Permanent address is required.'],
  },
  profileImg: { type: String },
 
  bloodGroup: {
    type: String,
    enum: {
      values: ['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'],
      message: '{VALUE} is not a valid blood group.',
    },
  },
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  isDeleted:{
    type: Boolean,
    default:false
  }
},{toJSON:{virtuals:true}});

studentSchema.virtual('fullName').get(function(){
  return `${this.name.firstName} ${this.name.lastName}`
})

studentSchema.pre('find',async function(next){
  this.find({isDeletes:{$ne:true}})
  next();
})
studentSchema.pre('findOne',async function(next){
  this.find({isDeletes:{$ne:true}})
  next();
})
studentSchema.pre('aggregate',async function(next){
  this.pipeline().unshift({$match:{isDeletes:{$ne:true}}})
  next();
})



// creating a custom static method 

studentSchema.statics.isUserExists=async function(id:string){
    const existingUser = await Student.findOne({id});
    return existingUser;
  }



export const Student = model<TStudent,StudentModel>('Student', studentSchema);
