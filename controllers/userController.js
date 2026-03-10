import userModel from "../models/user.model.js";
import cloudinaryUpload from "../utils/cloudinary.js";
import geminiResponse from "../gemini.js";

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
    const { assistantName, imageUrl, voicePreference } = req.body;
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
        assistantImg: finalImgUrl,
        voicePreference: voicePreference || 'girl'
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
        const { command } = req.body || 'who are you, and what is your purpose?';
        const user = await userModel.findById(req.userId);
        if (!user) {
            return res.status(401).json({ message: 'User not found' });
        }
        let userName = user.name;
        let assistantName = user.assistantName || "Sia";
        user.chatHistory.push(command);
        user.save();
        let response = await geminiResponse(command, assistantName, userName);

        // Extract the text content from Gemini API response
        const responseText = response.candidates?.[0]?.content?.parts?.[0]?.text;
        if (!responseText) {
            return res.status(400).json({ message: "Sorry, I couldn't get a response from the assistant." });
        }

        const jsonMatch = responseText.match(/{[\s\S]*}/);
        if (!jsonMatch) {
            return res.status(400).json({ message: "Sorry, I couldn't understand that." });
        } else {
          const aiResponse = JSON.parse(jsonMatch[0]);
          // For actions that require frontend handling, just return the response
          // Frontend will handle opening URLs, etc., based on type
          const responseToUser = aiResponse.response || "Sorry, I couldn't get a response from the assistant.";
          
          return res.status(200).json({ 
              response: responseToUser,
              type: aiResponse.type,
              userInput: aiResponse.userInput,
              // include full parsed object for debugging or future use
              aiResponse
          });
        }

    } catch (error) {
        console.error("Error asking Gemini:", error);
        res.status(500).json({ message: "Error asking Gemini" });
    }
}