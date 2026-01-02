import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import cookieParser from "cookie-parser";
import connectToDB from "./database/db.js";
import userRouter from "./routes/user.route.js";

dotenv.config();
const app = express();

const PORT = process.env.PORT || 3000;

connectToDB();

// default middleware
app.use(
  cors({
    origin: "http://localhost:5174",
    credentials: true,
  })
);
app.use(express.json());
app.use(cookieParser());

//apis
app.use("/api/v1/user", userRouter);

app.listen(PORT, () => {
  console.log(`Server started on port ${PORT}`);
});
