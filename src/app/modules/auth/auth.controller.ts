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
    httpOnly:true
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
  refreshToken
}
