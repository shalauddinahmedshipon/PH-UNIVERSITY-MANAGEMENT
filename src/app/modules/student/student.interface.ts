import { Model, Types } from "mongoose";

export type TGuardian = {
  fatherName: string;
  fatherOccupation: string;
  fatherContactNo: string;
  motherName: string;
  motherOccupation: string;
  motherContactNo: string;
};

export type TLocalGuardian = {
  name: string;
  address: string;
  contactNo: string;
};

export type TUserName = {
  firstName: string;
  middleName?: string;
  lastName: string;
};

export type TStudent = {
  id: string;
  user:Types.ObjectId;
  name: TUserName;
  gender: 'male' | 'female'|'other';
  dateOfBirth?: Date;
  email: string;
  contactNo: string;
  emergencyContactNo: string;
  bloodGroup?: 'A+' | 'A-' | 'B+' | 'B-' | 'AB+' | 'AB-' | 'O+' | 'O-';
  presentAddress: string;
  permanentAddress: string;
  guardian: TGuardian;
  localGuardian: TLocalGuardian;
  profileImg?: string;
  admissionSemester: Types.ObjectId;
  isDeleted:boolean;
};



// for creating static 
export interface StudentModel extends Model<TStudent> {
  isUserExists(id:string) : Promise<TStudent|null>
}









// for creating instance 

// export type StudentMethods ={
//   isUserExists(id:string) : Promise<TStudent|null>
// }

// export type StudentModel = Model<TStudent, Record<string,never>, StudentMethods>;
