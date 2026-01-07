import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectToDB from "./database/db.js";
import userRouter from "./routes/user.route.js";
import mediaRouter from "./routes/media.route.js";
import courseRouter from "./routes/course.route.js";
import purchaseCourseRouter from "./routes/purchaseCourse.route.js";
import courseProgressRouter from "./routes/courseProgress.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

connectToDB();

// default middleware
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//apis
app.use("/api/v1/user", userRouter);
app.use("/api/v1/media", mediaRouter);
app.use("/api/v1/course", courseRouter);
app.use("/api/v1/purchase", purchaseCourseRouter);
app.use("/api/v1/progress", courseProgressRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
