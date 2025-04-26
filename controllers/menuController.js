import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { FoodItem } from "../models/menuSchema.js";
import { v2 as cloudinary } from "cloudinary";

export const saveItem = catchAsyncErrors(async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Food Image Required.", 400));
  }

  const { foodimage } = req.files;
  const prices = JSON.parse(req.body.prices);

  // Validate the uploaded file's format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(foodimage.mimetype)) {
    return next(new ErrorHandler("File format not supported.", 400));
  }

  // Destructure required fields from the request body
  const {
    name,
    description,
    roasted,
    average_rating,
    ratings_count,
    type,
    ingredients,
    special_ingredient,
    category
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !description ||
    !roasted ||
    !average_rating ||
    !ratings_count ||
    !type ||
    !ingredients ||
    !special_ingredient ||
    !prices ||
    !category
  ) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  // Upload the image to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    foodimage.tempFilePath,
    {
      folder: "BREEZE_BITES",
    }
  );

  // Check for Cloudinary upload errors
  if (!cloudinaryResponse || cloudinaryResponse.error) {
    console.error(
      "Cloudinary error:",
      cloudinaryResponse.error || "Unknown cloudinary error."
    );
    return next(
      new ErrorHandler("Failed to upload food image to Cloudinary.", 500)
    );
  }

  // Create the food item in the database
  const foodItem = await FoodItem.create({
    name,
    description,
    roasted,
    average_rating: parseFloat(average_rating), // Ensure the rating is stored as a number
    ratings_count: parseInt(ratings_count, 10), // Ensure the count is stored as an integer
    type,
    ingredients,
    special_ingredient,
    prices: prices, // Parse the prices object
    image: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
    category
  });

  // Send success response
  res.status(201).json({
    success: true,
    message: "Food item added successfully.",
    data: foodItem,
  });
});

export const getItems = catchAsyncErrors(async (req, res, next) => {
  // Retrieve all food items from the database
  const foodItems = await FoodItem.find();

  // Check if any items exist
  if (!foodItems || foodItems.length === 0) {
    return res.status(404).json({
      success: false,
      message: "No food items found.",
    });
  }

  // Send the food items in the response
  res.status(200).json({
    success: true,
    data: foodItems,
  });
});


export const updateItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params; // Get the menu item ID from the request
  const {
    name,
    description,
    roasted,
    average_rating,
    ratings_count,
    type,
    ingredients,
    special_ingredient,
    prices,
    category,
  } = req.body;

  if (
    !name ||
    !description ||
    !roasted ||
    !average_rating ||
    !ratings_count ||
    !type ||
    !ingredients ||
    !special_ingredient ||
    !prices ||
    !category
  ) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }
  // Find the item in the database
  let foodItem = await FoodItem.findById(id);
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found.", 404));
  }

  // Handle Image Upload if a new image is provided
  if (req.files && req.files.foodimage) {

    const { foodimage } = req.files;

    // Validate image format
    const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
    if (!allowedFormats.includes(foodimage.mimetype)) {
      return next(new ErrorHandler("File format not supported.", 400));
    }

    // Delete the previous image from Cloudinary
    await cloudinary.uploader.destroy(foodItem.image.public_id);

    // Upload new image to Cloudinary
    const cloudinaryResponse = await cloudinary.uploader.upload(
      foodimage.tempFilePath,
      { folder: "BREEZE_BITES" }
    );

    if (!cloudinaryResponse || cloudinaryResponse.error) {
      return next(
        new ErrorHandler("Failed to upload food image to Cloudinary.", 500)
      );
    }

    console.log("New image uploaded successfully:", cloudinaryResponse);

    // Update image details
    foodItem.image = {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    };
  }

  // Update other fields
  foodItem.name = name || foodItem.name;
  foodItem.description = description || foodItem.description;
  foodItem.roasted = roasted || foodItem.roasted;
  foodItem.average_rating = average_rating
    ? parseFloat(average_rating)
    : foodItem.average_rating;
  foodItem.ratings_count = ratings_count
    ? parseInt(ratings_count, 10)
    : foodItem.ratings_count;
  foodItem.type = type || foodItem.type;
  foodItem.ingredients = ingredients || foodItem.ingredients;
  foodItem.special_ingredient =
    special_ingredient || foodItem.special_ingredient;
  foodItem.prices = prices ? JSON.parse(prices) : foodItem.prices;
  foodItem.category = category ? category : foodItem.category;


  // Save updated food item
  await foodItem.save();

  res.status(200).json({
    success: true,
    message: "Food item updated successfully.",
    data: foodItem,
  });
});

export const deleteItem = catchAsyncErrors(async (req, res, next) => {
  const { id } = req.params;

  // Find the food item by ID
  const foodItem = await FoodItem.findById(id);
  if (!foodItem) {
    return next(new ErrorHandler("Food item not found.", 404));
  }

  // Delete image from Cloudinary
  if (foodItem.image && foodItem.image.public_id) {
    await cloudinary.uploader.destroy(foodItem.image.public_id);
  }

  // Delete item from database
  await FoodItem.findByIdAndDelete(id);

  res.status(200).json({
    success: true,
    message: "Food item deleted successfully.",
  });
});
