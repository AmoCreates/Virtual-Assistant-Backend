import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    username: String,
    
    email: {
        type: String,
        unique: true
    },

    password: String,

    assistantName: String,

    assistantImg: String,

    voicePreference: String,

    chatHistory: [
        {
            type:String
        }
    ]

}, {timestamps: true});

const user = mongoose.model('User', userSchema);
export default user;