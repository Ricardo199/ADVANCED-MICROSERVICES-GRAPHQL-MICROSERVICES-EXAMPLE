import mongoose from 'mongoose';
import {config} from './config.js';

const connectDB = async () => {
    try{
        if(!config.db){
            throw new Error("MongoDB URI is undefined. Check your environment variables.");
        }
        await mongoose.connect(config.db);
        console.log(`✅ Auth Service connected to MongoDB at ${config.db}`);
    }catch(err){
        console.error('❌ Error connecting to MongoDB (Auth Service):', err.message);
    }
};

export default connectDB;