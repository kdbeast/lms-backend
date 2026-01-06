import {Schema, model} from "mongoose";

const CoursePurchaseSchema = new Schema({
  courseId: {
    type: Schema.Types.ObjectId,
    ref: 'Course', 
    required: true,
  },
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User', 
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  status: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending',
  },
  paymentIntentId: {
    type: String,
    required: true,
  }
},{timestamps:true});

export const CoursePurchase = model('CoursePurchase', CoursePurchaseSchema);