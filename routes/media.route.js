import express from "express";
import upload from "../utils/multer.js";
import { getLoadUrl, getUploadUrl, uploadToR2 } from "../utils/r2.js";
// import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadToR2(req.file, req.file.originalname);
    return res.status(201).json({
      data: result,
      success: true,
      message: "File uploaded successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to upload file" });
  }
});

router.route("/get-upload-url").get(async (req, res) => {
  try {
    const url = await getUploadUrl(req.query.filename, req.query.type);
    return res.status(200).json({
      data: url,
      success: true,
      message: "Upload URL generated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to generate upload URL" });
  }
});

router.route("/get-file-url").post(async (req, res) => {
  try {
    const url = await getLoadUrl(req.body.filename);
    return res.status(200).json({
      data: url,
      success: true,
      message: "File URL generated successfully",
    });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to generate file URL" });
  }
});

export default router;
