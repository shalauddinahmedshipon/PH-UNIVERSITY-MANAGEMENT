import { model, Schema } from "mongoose";
import { IUser, UserModel } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";  


const UserSchema = new Schema<IUser,UserModel>({
  id: {
    type: String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required:true,
    select:0
  },
  needsPasswordChange: {
    type: Boolean,
    default:true
  },
  passwordChangedAt:{
    type:Date
  },
  isDeleted: {
    type: Boolean,
    default:false
  },
  status: {
    type: String,
    enum:['in-progress','blocked'],
    default:'in-progress'
  },
  role: {
    type: String,
    enum:['admin','student','faculty'],

  }
},
{
  timestamps:true
})


// pre-save middleware / hooks 
UserSchema.pre('save',async function(next){
  const user = this;
  user.password = await bcrypt.hash(user.password , Number(config.bcrypt_solt))
  // console.log(this,'pre-hook: we save data');
  next();
})
// post save middleware/hooks 
UserSchema.post('save',function(doc,next){
  doc.password = '';
  next();
  
})

UserSchema.statics.isUserExistsByCustomId=async function (id:string) {
return  await User.findOne({id}).select('+password');
}

UserSchema.statics.isPasswordMatched= async function(plainTextPassword,hashedPassword){
return await bcrypt.compare(plainTextPassword,hashedPassword);
}

UserSchema.statics.isJWTIssuedBeforePasswordChanged=function(passwordChangedTimestamp:Date,
  jwtIssuedTimestamp:number
){
const passwordChangedTime = new Date(passwordChangedTimestamp).getTime()/1000;
return passwordChangedTime>jwtIssuedTimestamp ; 
}


export const User = model<IUser,UserModel>('User',UserSchema);

