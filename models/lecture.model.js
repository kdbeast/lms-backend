import { Schema, model } from "mongoose";

const lectureSchema = new Schema(
  {
    lectureTitle: {
      type: String,
      required: true,
    },
    videoUrl: {
      type: String,
    },
    publicId: {
      type: String,
    },
    isPreviewFree: {
      type: Boolean,
    },
    sectionId: {
      type: Schema.Types.ObjectId,
      ref: "Section",
    },
    order: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true },
);

export const Lecture = model("Lecture", lectureSchema);
