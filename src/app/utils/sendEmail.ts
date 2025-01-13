import nodemailer from "nodemailer";
import config from "../config";



export const sendEmail =async(email:string,html:string)=>{
  const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: config.NODE_ENV==="production",
    auth: {
      user: "shalauddinahmedshipon@gmail.com",
      pass: "qzlt iyec zlxs trte",
    },
  });

  // send mail with defined transport object
    await transporter.sendMail({
    from: 'shalauddinahmeddshipon@gmail.com',
    to: email, 
    subject: "change your password",
    text: "Reset your password within 10 minutes",
    html: html,
  });
} 
