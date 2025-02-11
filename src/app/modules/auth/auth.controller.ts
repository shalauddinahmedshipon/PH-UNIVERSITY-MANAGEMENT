import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";


const loginUser = catchAsync(
  async (req, res) => {
    const result = await authServices.loginUser(req.body);

   const {refreshToken,accessToken,needsPasswordChange} = result;
   res.cookie('refreshToken',refreshToken,{
    secure:process.env.NODE_ENV==='production',
    httpOnly:true,
    // sameSite:'none',
    // maxAge: 1000 * 60 * 60 * 24 * 365,
   })

    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:' user login successfully',
      data:{
        accessToken,
        needsPasswordChange
      }
    })
   
  }
);

const changePassword = catchAsync(
  async (req, res) => {
    const {...passwordData} = req.body;
    console.log(req.user,passwordData);
    const result = await authServices.changPasswordIntoDB( req.user, passwordData );
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Password change successfully',
      data:result
    })
   
  }
);

const forgetPassword = catchAsync(
  async (req, res) => {
    const userId = req.body.id;

    const result = await authServices.forgetPassword( userId );
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Reset link is generated successfully',
      data:result
    })
   
  }
);

const resetPassword = catchAsync(
  async (req, res) => {
    const token = req.headers.authorization;
    const payload = req.body;
    const { id, newPassword } = req.body;
    console.log(id, newPassword);
    const result = await authServices.resetPassword( payload,token as string);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'Reset password successfully',
      data:result
    })
   
  }
);

const refreshToken = catchAsync(
  async (req, res) => {
    const {refreshToken} = req.cookies;
    const result = await authServices.refreshToken(refreshToken);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:'access token is retrieve successfully',
      data:result
    })
   
  }
);


export const authControllers={
  loginUser,
  changePassword,
  forgetPassword ,
  refreshToken,
  resetPassword 
}
