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

export const authControllers={
  loginUser
}
