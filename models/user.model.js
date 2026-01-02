import { Schema, model } from "mongoose";

const userSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
    },
    password: {
      type: String,
      required: true,
    },
    role: {
      type: String,
      enum: ["instructor", "student"],
      default: "student",
    },
    enrolledCourses: [
      {
        type: Schema.Types.ObjectId,
        ref: "Course",
      },
    ],
    photoUrl: {
      type: String,
      default: "",
    },
  },
  {
    timestamps: true,
  }
);

export const User = model("User", userSchema);
