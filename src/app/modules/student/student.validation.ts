import { z } from 'zod';

const userNameValidationSchema = z.object({
  firstName: z
    .string()
    .max(20, "First name cannot be more than 20 characters.")
    .refine((value) => /^[A-Z][a-zA-Z]*$/.test(value), {
      message: "First name must be in capitalized format.",
    }),
  middleName: z.string().optional(),
  lastName: z
    .string()
    .refine((value) => /^[a-zA-Z]+$/.test(value), {
      message: "Last name must contain only alphabetic characters.",
    }),
});

const guardianValidationSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required."),
  fatherOccupation: z.string().nonempty("Father's occupation is required."),
  fatherContactNo: z.string().nonempty("Father's contact number is required."),
  motherName: z.string().nonempty("Mother's name is required."),
  motherOccupation: z.string().nonempty("Mother's occupation is required."),
  motherContactNo: z.string().nonempty("Mother's contact number is required."),
});

const localGuardianValidationSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required."),
  address: z.string().nonempty("Local guardian's address is required."),
  contactNo: z.string().nonempty("Local guardian's contact number is required."),
});

const createStudentValidationSchema = z.object({
  body: z.object({
    password:z.string().nonempty('Password is required ').max(20),
    student:z.object({
      name: userNameValidationSchema,
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: "Gender must be 'male', 'female', or 'other'." }),
      }),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email("Email must be a valid email address.")
        .nonempty("Email address is required."),
      contactNo: z.string().nonempty("Contact number is required."),
      emergencyContactNo: z.string().nonempty("Emergency contact number is required."),
      presentAddress: z.string().nonempty("Present address is required."),
      permanentAddress: z.string().nonempty("Permanent address is required."),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional()
        .refine((value) => value, {
          message: "Blood group must be a valid type.",
        }),
      admissionSemester:z.string(),
      academicDepartment: z.string(),
      guardian: guardianValidationSchema,
      localGuardian: localGuardianValidationSchema
    }
      
    )
  })
});

const updateStudentValidationSchema = z.object({
  body: z.object({
    student: z.object({
      name: z.object({
        firstName: z.string().optional(),
        lastName: z.string().optional(),
        middleName: z.string().optional(),
      }).optional(),
      gender: z.enum(['male', 'female', 'other'], {
        errorMap: () => ({ message: "Gender must be 'male', 'female', or 'other'." }),
      }).optional(),
      dateOfBirth: z.string().optional(),
      email: z
        .string()
        .email("Email must be a valid email address.")
        .optional(),
      contactNo: z.string().optional(),
      emergencyContactNo: z.string().optional(),
      presentAddress: z.string().optional(),
      permanentAddress: z.string().optional(),
      profileImg: z.string().optional(),
      bloodGroup: z
        .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
        .optional(),
      
      admissionSemester: z.string().optional(),
      academicDepartment: z.string().optional(),
      guardian: z
      .object({
        fatherName: z.string().optional(),
        fatherOccupation: z.string().optional(),
        fatherContactNo: z.string().optional(),
        motherName: z.string().optional(),
        motherOccupation: z.string().optional(),
        motherContactNo: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    localGuardian: z
      .object({
        name: z.string().optional(),
        occupation: z.string().optional(),
        contactNo: z.string().optional(),
        address: z.string().optional(),
      })
      .optional(),
    }),
  }),
});


export const studentValidations = {
createStudentValidationSchema,
updateStudentValidationSchema

}
