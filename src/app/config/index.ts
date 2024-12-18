import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });

export default {
  NODE_ENV:process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DB_URL,
  bcrypt_solt:process.env.BCRYPT_SOLT,
  default_password:process.env.DEFAULT_PASS
};
