import { v2 as cloudinary } from 'cloudinary';

const cloudinaryUpload = async (localFilePath) => {
    if(!filePath) return null;

    cloudinary.config({ 
        cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
        api_key: process.env.CLOUDINARY_API_KEY, 
        api_secret: process.env.CLOUDINARY_API_SECRET,
    });

    try {
        const uploadResult = await cloudinary.uploader.upload(localFilePath, {
            resource_type: 'image',
            folder: "assistants"
        })

       console.log('file successfully uploaded on cloudinary', uploadResult.secure_url);
       return uploadResult.secure_url;
    } catch (error) {
        return console.log(error);
    }    
}

export default cloudinaryUpload;