import { StatusCodes } from "http-status-codes";
import jwt  from "jsonwebtoken";
import AppError from "../../error/AppError";
import { User } from "../user/user.model";
import { TLogin } from "./auth.interface";



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




const accessToken= jwt.sign(jwtPayload,process.env.JWT_ACCESS_SECRET as string, { expiresIn: '10d' });


  return {
    accessToken,
    needsPasswordChange:user?.needsPasswordChange
  }
}

export const authServices ={
  loginUser
}