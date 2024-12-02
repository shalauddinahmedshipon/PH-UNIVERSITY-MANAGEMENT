import { model, Schema } from "mongoose";
import { TUser } from "./user.interface";
import config from "../../config";
import bcrypt from "bcrypt";  

const UserSchema = new Schema<TUser>({
  id: {
    type: String,
    required:true,
    unique:true
  },
  password: {
    type: String,
    required:true
  },
  needsPasswordChange: {
    type: Boolean,
    default:true
  },
  isDeleted: {
    type: Boolean,
    default:false
  },
  status: {
    type: String,
    enum:['in-progress','blocked'],
    default:'in-progress'
  },
  role: {
    type: String,
    enum:['admin','student','faculty'],

  }
},
{
  timestamps:true
})





// pre-save middleware / hooks 
UserSchema.pre('save',async function(next){
  const user = this;
  user.password = await bcrypt.hash(user.password , Number(config.bcrypt_solt))
  // console.log(this,'pre-hook: we save data');
  next();
})
// post save middleware/hooks 
UserSchema.post('save',function(doc,next){
  doc.password = '';
  next();
})


export const User = model<TUser>('User',UserSchema);

