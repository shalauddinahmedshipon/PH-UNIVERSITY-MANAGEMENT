import dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.join(process.cwd(), '.env') });
console.log('Loading .env file from:', path.join(process.cwd(), '.env'));

const config = {
  NODE_ENV: process.env.NODE_ENV,
  port: process.env.PORT,
  databaseUrl: process.env.DB_URL,
  bcrypt_solt: process.env.BCRYPT_SOLT,
  default_password: process.env.DEFAULT_PASS,
  jwt_access_secret: process.env.JWT_ACCESS_SECRET,
};

export default config;
