import { Schema, model } from "mongoose";

const sectionSchema = new Schema(
  {
    sectionTitle: {
      type: String,
      required: true,
    },

    courseId: {
      type: Schema.Types.ObjectId,
      ref: "Course",
      required: true,
    },

    lectures: [
      {
        type: Schema.Types.ObjectId,
        ref: "Lecture",
      },
    ],
  },
  { timestamps: true },
);

export const Section = model("Section", sectionSchema);
