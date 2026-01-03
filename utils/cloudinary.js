import dotenv from "dotenv";
import { v2 as cloudinary } from "cloudinary";

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export default cloudinary;

export const uploadToCloudinary = async (file) => {
  try {
    const uploadResponse = await cloudinary.uploader.upload(file, {
      resource_type: "auto",
    });
    return uploadResponse;
  } catch (error) {
    console.log(error);
  }
};

export const deleteFromCloudinary = async (public_id) => {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(public_id);
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};

export const deleteVideoFromCloudinary = async (public_id) => {
  try {
    const deleteResponse = await cloudinary.uploader.destroy(public_id, {
      resource_type: "video",
    });
    return deleteResponse;
  } catch (error) {
    console.log(error);
  }
};
