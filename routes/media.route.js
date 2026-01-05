import express from "express";
import upload from "../utils/multer.js";
import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadToCloudinary(req.file.path);
    res.status(201).json({
      data: result,
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to upload file" });
  }
});

export default router;
