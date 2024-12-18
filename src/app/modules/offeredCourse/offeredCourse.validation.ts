import { z } from 'zod';
import { Days } from './offeredCourse.constant';


const timeStringSchema = z.string().refine((time)=>{
  const regex = /^(?:[01]\d|2[0-3]):[0-5]\d$/;
  return regex.test(time);
  
},{
  message:"Invalid time format, expected 'HH:MM' in 24 hours format"
})

export const createOfferedCourseValidationSchema = z.object({
  body:z.object({
  semesterRegistration: z.string(),
  academicFaculty: z.string(),
  academicDepartment: z.string(),
  course: z.string(),
  faculty: z.string(),
  maxCapacity: z.number(), 
  section: z.number(),
  days: z.array(z.enum([...Days] as [string,...string[]])),
  startTime:timeStringSchema ,
  endTime:timeStringSchema,
  }).refine((body)=>{
    const start = new Date(`1970-01-01T${body.startTime}:00`);
    const end = new Date(`1970-01-01T${body.endTime}:00`);
    console.log(start, end);
    return end > start;
  },{
    message:"start time should be before end time"
  })
});

export const updateOfferedCourseValidationSchema = z.object({
  body:z.object({
  faculty: z.string(),
  maxCapacity: z.number(),
  days: z.array(z.enum([...Days] as [string,...string[]])),
  startTime:timeStringSchema,
  endTime: timeStringSchema,
  }).refine((body)=>{
    const start = new Date(`1970-01-01T${body.startTime}:00`);
    const end = new Date(`1970-01-01T${body.endTime}:00`);
    console.log(start, end);
    return end > start;
  },{
    message:"start time should be before end time"
  })
});

export const OfferedCourseValidation ={
  createOfferedCourseValidationSchema,
  updateOfferedCourseValidationSchema
}
