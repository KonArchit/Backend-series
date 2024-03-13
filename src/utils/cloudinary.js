import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

          
cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
  api_secret: process.env.CLOUDINARY_API_SECRET 
});

const uploadOnCloudinary = async function(localfilepath) {
    try {
        if(!localfilepath) return null;
        // upload the file on cloudinary
        const response = await cloudinary.uploader.upload(localfilepath, {
            resource_type: "auto",
        })
        // File has been uploaded successfully
        console.log("File uploaded to the cloudinary", response.url)
        return response;
    } catch (error) {
        // Remove the locally saved temporary file as the upload operation failed.
        fs.unlinkSync(localfilepath) 
        return null;
    }
}

export {uploadOnCloudinary}