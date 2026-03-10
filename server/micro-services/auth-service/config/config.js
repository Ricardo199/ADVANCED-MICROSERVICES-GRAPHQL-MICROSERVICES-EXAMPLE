import dotenv from 'dotenv';

dotenv.config();
//configuration for auth services
export const config = {
    db: process.env.AUTH_MONGO_URI || 'mongodb://localhost:27017/authServiceDB',
    JWT_SECRET: process.env.JWT_SECRET || 'default_secret_key',
    port: process.env.AUTH_PORT || 4001
};

if (process.env.NODE_ENV !== 'production'){
    console.log(`🔐JWT_SECRET in auth-service config: ${config.JWT_SECRET}`);
    console.log(`🚀DB_URI in auth-service config: ${config.db}`);
}