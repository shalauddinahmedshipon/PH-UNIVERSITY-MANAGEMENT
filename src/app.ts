import express, { Application, Request, Response } from 'express';
import cors from 'cors';
import globalErrorHandler from './app/middlewares/globalErrorHandler';
import notFound from './app/middlewares/notFound';
import router from './app/routes/Index';
import cookieParser from 'cookie-parser';

const app: Application = express();

// middleware
app.use(express.json());
app.use(cookieParser());
app.use(cors({origin:['http://localhost:5173'],credentials:true}));

// application routes
app.use('/api/v1', router);
   //  test 
    const test = async(req:Request,res:Response)=>{
    const a = 10;
    res.send(a);
       }
      app.get('/',test);

app.use(globalErrorHandler);
//  not found 
app.use(notFound);

export default app;
