import mongoose from "mongoose";

const connection = async () => {
    try {
        await mongoose.connect(`${process.env.MONGO_DB_URI}/VirtualAssistant`);
        console.log('DATABASE CONNECTION DONE SUCCESSFULLY');
    } catch (error) {
        console.log("ERROR!! MONGO_DB CONNECTION FAILED, err: ",error);
    }
}

export default connection;