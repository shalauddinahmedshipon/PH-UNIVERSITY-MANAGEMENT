import { StatusCodes } from "http-status-codes";
import catchAsync from "../../utils/catchAsync";
import sendResponse from "../../utils/sendResponse";
import { authServices } from "./auth.service";

const loginUser = catchAsync(
  async (req, res) => {
    const result = await authServices.loginUser(req.body);
    sendResponse(res,{
      statusCode:StatusCodes.OK,
      success:true,
      message:' user login successfully',
      data:result
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


export const authControllers={
  loginUser,
  changePassword
}
