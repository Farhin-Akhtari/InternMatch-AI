import mongoose from "mongoose";

const connectDB = async () => {
    try{
      const connectionInstance = await mongoose.connect(process.env.MONGODB_URI);
      console.log(`\n MongoDB connected !! DB HOST: ${connectionInstance.connection.host}`)
     console.log(` Database: ${connectionInstance.connection.name}`);
     return connectionInstance;
    }catch(error){
        console.error("MONGODB Connection failed", error.message);
        throw error;
    }
};

export default connectDB;