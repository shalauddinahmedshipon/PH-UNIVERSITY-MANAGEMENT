import { z } from 'zod';

const userNameSchema = z.object({
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

const guardianSchema = z.object({
  fatherName: z.string().nonempty("Father's name is required."),
  fatherOccupation: z.string().nonempty("Father's occupation is required."),
  fatherContactNo: z.string().nonempty("Father's contact number is required."),
  motherName: z.string().nonempty("Mother's name is required."),
  motherOccupation: z.string().nonempty("Mother's occupation is required."),
  motherContactNo: z.string().nonempty("Mother's contact number is required."),
});

const localGuardianSchema = z.object({
  name: z.string().nonempty("Local guardian's name is required."),
  address: z.string().nonempty("Local guardian's address is required."),
  contactNo: z.string().nonempty("Local guardian's contact number is required."),
});

const studentSchema = z.object({
  id: z.string().nonempty("Student ID is required."),
  name: userNameSchema,
  gender: z.enum(['male', 'female', 'other'], {
    errorMap: () => ({ message: "Gender must be 'male', 'female', or 'other'." }),
  }),
  password:z.string().nonempty('Password is required ').max(20),
  dateOfBirth: z.string().optional(),
  email: z
    .string()
    .email("Email must be a valid email address.")
    .nonempty("Email address is required."),
  contactNo: z.string().nonempty("Contact number is required."),
  emergencyContactNo: z.string().nonempty("Emergency contact number is required."),
  presentAddress: z.string().nonempty("Present address is required."),
  permanentAddress: z.string().nonempty("Permanent address is required."),
  profileImg: z.string().optional(),
  isActive: z
    .enum(['active', 'blocked'])
    .default('active')
    .refine((value) => ['active', 'blocked'].includes(value), {
      message: "Status must be 'active' or 'blocked'.",
    }),
  bloodGroup: z
    .enum(['A+', 'A-', 'B+', 'B-', 'AB+', 'AB-', 'O+', 'O-'])
    .optional()
    .refine((value) => value, {
      message: "Blood group must be a valid type.",
    }),
  guardian: guardianSchema,
  localGuardian: localGuardianSchema,
  isDeleted:z.boolean()
});

export default studentSchema;
