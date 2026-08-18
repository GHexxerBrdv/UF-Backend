import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();

const DBConnection = async ()=>{
    try {
       await mongoose.connect(process.env.DB_URL,{useNewUrlParser : true})
        console.log('Databse connected');
    } catch (error) {
        console.error('Error while connecting with database',error.message);
    }
}

export default DBConnection;