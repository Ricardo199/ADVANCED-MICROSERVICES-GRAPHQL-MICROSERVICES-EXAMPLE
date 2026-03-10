import dotenv from 'dotenv';
dotenv.config();

export const config = {
    db: process.env.DB_URI || 'mongodb://localhost:27017/product-service',
    JWT_SECRET: process.env.JWT_SECRET || 'fallback_secret',
    port: process.env.PORT || 4002,
};

if(process.env.NODE_ENV === 'production') {
    console.log(`🔐 JWT_SECRET in product-service config: ${config.JWT_SECRET}`)
    console.log(`🚀 Product Microservice running on port: ${config.port}`)
}