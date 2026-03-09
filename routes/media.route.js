import express from "express";
import upload from "../utils/multer.js";
import { uploadToR2 } from "../utils/r2.js";
// import { uploadToCloudinary } from "../utils/cloudinary.js";

const router = express.Router();

router.route("/upload-video").post(upload.single("file"), async (req, res) => {
  try {
    const result = await uploadToR2(req.file);
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

export default router;
