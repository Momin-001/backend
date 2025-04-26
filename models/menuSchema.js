import mongoose from "mongoose";

const FoodItemSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  roasted: { type: String, required: true },
  average_rating: { type: Number, required: true },
  ratings_count: { type: Number, required: true },
  type: { type: String, required: true },
  ingredients: { type: String, required: true },
  special_ingredient: { type: String, required: true },
  category:{type: String, required:true},
  image: {
    public_id: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
  },
  prices: [
    {
      size: { type: String, },
      price: { type: Number, },
      currency: { type: String, default: 'Rs' },
    },
  ],
});


export const FoodItem = mongoose.model('fooditems', FoodItemSchema);
