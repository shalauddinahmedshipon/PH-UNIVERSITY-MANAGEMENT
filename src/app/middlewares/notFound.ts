/* eslint-disable @typescript-eslint/no-unused-vars */ 
/* eslint-disable @typescript-eslint/no-explicit-any */
 
import {NextFunction, Request, Response } from 'express';

import {
	ReasonPhrases,
	StatusCodes,
	getReasonPhrase,
	getStatusCode,
} from 'http-status-codes';


const notFound =( req:Request, res:Response, next:NextFunction)=>{
 
 
  return res.status(StatusCodes.NOT_FOUND).json(
    {
      success:false,
      message:'page not found',
      error:''
    }
  )
  }

  export default notFound;