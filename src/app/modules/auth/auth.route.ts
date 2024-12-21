import express from 'express';
import validateRequest from '../../middlewares/validateRequest';
import { AuthValidation } from './auth.validation';
import { authControllers } from './auth.controller';
import auth from '../../middlewares/auth';
import { USER_ROLE } from '../user/user.constant';

const router = express.Router();

router.post('/login',
  validateRequest(AuthValidation.loginValidationSchema),authControllers.loginUser
);
router.post('/change-password',
  auth(USER_ROLE.admin,USER_ROLE.faculty,USER_ROLE.student),
  validateRequest(AuthValidation.changePasswordValidationSchema),authControllers.changePassword
);




export const AuthRoutes = router;
