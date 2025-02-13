import { StatusCodes } from "http-status-codes";
import  { JwtPayload }  from "jsonwebtoken";
import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import { TLogin } from "./auth.interface";
import bcrypt from 'bcrypt'
import { createToken, verifyToken } from "./auth.utils";
import jwt from "jsonwebtoken";
import { sendEmail } from "../../utils/sendEmail";



// import bcrypt from 'bcrypt';
const loginUser = async(payload:TLogin)=>{
  // checking if the user is exist 
const user =await User.isUserExistsByCustomId(payload.id);

if(!user){
  throw new AppError(StatusCodes.NOT_FOUND,
    'this user is not found'
  )
}
// //checking if the user is already deleted
const isDeleted = user?.isDeleted;
if(isDeleted){
  throw new AppError(StatusCodes.FORBIDDEN,
    'this user is already deleted'
  )
}
// //checking if the user is blocked
const userStatus = user?.status;
if(userStatus==='blocked'){
  throw new AppError(StatusCodes.FORBIDDEN,
    'this user is blocked!'
  )
}


// //checking if the password is correct 
if(!(await User.isPasswordMatched(payload?.password,user?.password))){
  throw new AppError(StatusCodes.FORBIDDEN,
        'password do not match!'
      )
}
 //Access Granted:Send AccessToken, RefreshToken

//create token and sent to the client
const jwtPayload ={
  userId:user.id,
  role:user.role,
}

const accessToken= createToken(jwtPayload,process.env.JWT_ACCESS_SECRET as string,process.env.JWT_ACCESS_EXPIRES_IN as string);

const refreshToken= createToken(jwtPayload,process.env.JWT_REFRESH_SECRET as string,process.env.JWT_REFRESH_EXPIRES_IN as string);


  return {
    accessToken,
    refreshToken,
    needsPasswordChange:user?.needsPasswordChange
  }
}


const changPasswordIntoDB = async(userData:JwtPayload,payload:{
  oldPassword:string,newPassword:string
})=>{
  console.log(userData,payload);
    // checking if the user is exist 
const user =await User.isUserExistsByCustomId(userData.userId);

if(!user){
  throw new AppError(StatusCodes.NOT_FOUND,
    'this user is not found'
  )
}
// //checking if the user is already deleted
const isDeleted = user?.isDeleted;
if(isDeleted){
  throw new AppError(StatusCodes.FORBIDDEN,
    'this user is already deleted'
  )
}
// //checking if the user is blocked
const userStatus = user?.status;
if(userStatus==='blocked'){
  throw new AppError(StatusCodes.FORBIDDEN,
    'this user is blocked!'
  )
}


// //checking if the password is correct 
if(!(await User.isPasswordMatched(payload?.oldPassword,user?.password))){
  throw new AppError(StatusCodes.FORBIDDEN,
        'password do not match!'
      )
}
// hash new password 
const newHashedPassword = await bcrypt.hash(payload.newPassword,Number(process.env.BCRYPT_SOLT));

 await User.findOneAndUpdate(
  {id:userData.userId,
  role:userData.role},
  {
    password:newHashedPassword,
    needsPasswordChange:false,
    passwordChangedAt:new Date()
  },
  {
    new:true
  }
)

  return null;
}

const forgetPassword=async(userId:string)=>{
 // checking if the user is exist 
 const user =await User.isUserExistsByCustomId(userId);

 if(!user){
   throw new AppError(StatusCodes.NOT_FOUND,
     'this user is not found'
   )
 }
 // //checking if the user is already deleted
 const isDeleted = user?.isDeleted;
 if(isDeleted){
   throw new AppError(StatusCodes.FORBIDDEN,
     'this user is already deleted'
   )
 }
 // //checking if the user is blocked
 const userStatus = user?.status;
 if(userStatus==='blocked'){
   throw new AppError(StatusCodes.FORBIDDEN,
     'this user is blocked!'
   )
 }


 const jwtPayload ={
  userId:user.id,
  role:user.role,
}

const resetToken= createToken(jwtPayload,process.env.JWT_ACCESS_SECRET as string,'10m');

const resetLink=`${process.env.RESET_PASS_UI_LINK}?id=${user.id}&token=${resetToken}`
sendEmail(user?.email,resetLink);
 console.log(resetLink);
}


const resetPassword=async(payload:{id:string,newPassword:string},token:string)=>{
 // checking if the user is exist 
 const user =await User.isUserExistsByCustomId(payload?.id);

 if(!user){
   throw new AppError(StatusCodes.NOT_FOUND,
     'this user is not found'
   )
 }
 // //checking if the user is already deleted
 const isDeleted = user?.isDeleted;
 if(isDeleted){
   throw new AppError(StatusCodes.FORBIDDEN,
     'this user is already deleted'
   )
 }
 // //checking if the user is blocked
 const userStatus = user?.status;
 if(userStatus==='blocked'){
   throw new AppError(StatusCodes.FORBIDDEN,
     'this user is blocked!'
   )
 }
 const decoded = jwt.verify(token,process.env.JWT_ACCESS_SECRET as string )as JwtPayload;

console.log(decoded);

if(payload.id!==decoded.userId){
  throw new AppError(StatusCodes.FORBIDDEN,'You can not change password')
}

// hash new password 
const newHashedPassword = await bcrypt.hash(payload.newPassword,Number(process.env.BCRYPT_SOLT));

 await User.findOneAndUpdate(
  {id:decoded.userId,
  role:decoded.role},
  {
    password:newHashedPassword,
    passwordChangedAt:new Date()
  },
  {
    new:true
  }
)



}

const refreshToken = async(token:string)=>{
 const decoded = verifyToken(token,process.env.JWT_REFRESH_SECRET as string)
//  jwt.verify(token,process.env.JWT_REFRESH_SECRET as string )as JwtPayload;

 const {userId,iat} = decoded;

// checking if the user is exist 
const user =await User.isUserExistsByCustomId(userId);

if(!user){
throw new AppError(StatusCodes.NOT_FOUND,
  'this user is not found'
)
}
// //checking if the user is already deleted
const isDeleted = user?.isDeleted;
if(isDeleted){
throw new AppError(StatusCodes.FORBIDDEN,
  'this user is already deleted'
)
}
// //checking if the user is blocked
const userStatus = user?.status;
if(userStatus==='blocked'){
throw new AppError(StatusCodes.FORBIDDEN,
  'this user is blocked!'
)
}

if(user.passwordChangedAt&&User.isJWTIssuedBeforePasswordChanged(
user.passwordChangedAt,
iat as number
)){
throw new AppError(StatusCodes.UNAUTHORIZED,"You are not authorized!")
}

//create token and sent to the client
const jwtPayload ={
  userId:user.id,
  role:user.role,
}

const accessToken= createToken(jwtPayload,process.env.JWT_ACCESS_SECRET as string,process.env.JWT_ACCESS_EXPIRES_IN as string);

return {accessToken}

}



export const authServices ={
  loginUser,
  changPasswordIntoDB,
  refreshToken,
  forgetPassword,
  resetPassword,
 
}

