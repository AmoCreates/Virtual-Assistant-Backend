import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

const cloudinaryUpload = async (localFilePath) => {
    if(!localFilePath) return console.log('path not found');
    
    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(localFilePath)

       console.log('file successfully uploaded on cloudinary', uploadResult.secure_url);
       fs.unlinkSync(localFilePath);
       return uploadResult.secure_url;
    } catch (error) {
        fs.unlinkSync(localFilePath);
        console.error("Cloudinary Upload Error:", error);
        throw error;
    }    
}

export default cloudinaryUpload;