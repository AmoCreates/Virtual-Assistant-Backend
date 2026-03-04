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
    const { assistantName, imageUrl } = req.body;
    let finalImgUrl;

    if (req.file) {
      finalImgUrl = await cloudinaryUpload(req.file.path);
    } else {
      finalImgUrl = imageUrl;
    }

    const user = await userModel.findByIdAndUpdate(
      req.userId,
      {
        assistantName,
        assistantImg: finalImgUrl
      },
      { new: true }
    ).select("-password");

    res.status(200).json(user);

  } catch (error) {
    console.log(error);
    res.status(400).json({ message: "Upload failed" });
  }
};

export const askAssistant = async (req, res) => {
    try {
        const { command } = req.body;
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        let userName = user.name;
        let assistantName = user.assistantName || "Sia";
        let response = await geminiResponse(command, assistantName, userName);

        const jsonMatch = response.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ message: "Sorry, I couldn't understand that." });
        } else {
            return res.status(200).json(JSON.parse(jsonMatch[0]));
        }

    } catch (error) {
        console.error("Error asking Gemini:", error);
        res.status(500).json({ message: "Error asking Gemini" });
    }
}