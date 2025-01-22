import { USER_ROLE } from "../modules/user/user.constant";
import { User } from "../modules/user/user.model";

const superUser={
  id:'0001',
  email:'superAdmin@gmail.com',
  password:process.env.SUPER_ADMIN_PASSWORD,
  needsPasswordChange:false,
  status:'in-progress',
  role:USER_ROLE.superAdmin,
  isDeleted:false
}

const seedSuperAdmin=async()=>{
  const isSuperAdminExists= await User.findOne({role:USER_ROLE.superAdmin});
 if(!isSuperAdminExists){
  await User.create(superUser);
 }

}

export default seedSuperAdmin;