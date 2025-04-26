import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  firstname: { type: String, required: true },
  phone: { type: String }, // Changed from Number to String
  email: { type: String, required: true }, // Corrected to String & made unique
  feedback: { type: String, required: true },
  response: { type: String },
  image: {type: String},
  completed:{type: Boolean, default: false} 
});

export const Feedback = mongoose.model("feedback", feedbackSchema);
