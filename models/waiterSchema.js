import mongoose from "mongoose";

const WaiterSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true }, // Corrected to String
  contact: { type: String, required:true, unique: true }, // Changed from Number to String
  number: { type: Number, required: true, unique: true }, // Corrected to String & made unique
  image: {
    public_id: { 
      type: String, 
       },
    url: { 
      type: String, 
       },
  },
});

export const Waiter = mongoose.model("waiters", WaiterSchema);
