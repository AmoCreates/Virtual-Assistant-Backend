import userModel from "../models/user.model.js";
import cloudinaryUpload from "../utils/cloudinary.js";

export const getCurrentUser = async (req, res) => {
    try {
        const userId = req.userId;
        let user = await userModel.findById(userId)
        .select("-password");

        if(!user) {
            return res.status(401).json({message: 'user not found'})
        }

        return res.status(200).json(user);

    } catch (error) {
        return res.status(401).json({message: "current user error"})
    }
}

export const updateAssistant = async (req, res) => {
    try {
        const { assistantName, assistantImg } = req.body; 
        let finalImgUrl = assistantImg; 

        if (req.file) {
            // This utility calls cloudinary.uploader.upload(req.file.path)
            const cloudinaryUrl = await cloudinaryUpload(req.file.path);
            finalImgUrl = cloudinaryUrl;
        }

        const user = await userModel.findByIdAndUpdate(
            req.userId, 
            { assistantName, assistantImg: finalImgUrl }, 
            { new: true }
        ).select('-password');

        // This is what the frontend will receive
        res.status(200).json(user);
    } catch (error) {
        res.status(400).json({ message: 'Upload failed' });
    }
};