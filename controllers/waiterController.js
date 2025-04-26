import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { FoodItem } from "../models/menuSchema.js";
import { v2 as cloudinary } from "cloudinary";
import { Waiter } from "../models/waiterSchema.js";
import { Order } from "../models/orderSchema.js";

export const saveWaiter = catchAsyncErrors(async (req, res, next) => {
  // Check if a file was uploaded
  if (!req.files || Object.keys(req.files).length === 0) {
    return next(new ErrorHandler("Waiter Image Required.", 400));
  }

  const { image } = req.files;

  // Validate the uploaded file's format
  const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
  if (!allowedFormats.includes(image.mimetype)) {
    return next(new ErrorHandler("Image File format not supported.", 400));
  }

  // Destructure required fields from the request body
  const {
    name,
    email,
    contact,
    number,
  } = req.body;

  // Validate required fields
  if (
    !name ||
    !email ||
    !contact ||
    !number 
  ) {
    return next(new ErrorHandler("Please fill all required fields.", 400));
  }

  const existingWaiter = await Waiter.findOne({
    $or: [
      { email },
      { number },
      { contact }
    ]
  });
  
  if (existingWaiter) {
    return next(new ErrorHandler("Waiter already exists.", 400));
  }
  

  // Upload the image to Cloudinary
  const cloudinaryResponse = await cloudinary.uploader.upload(
    image.tempFilePath,
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
      new ErrorHandler("Failed to upload Waiter image to Cloudinary.", 500)
    );
  }

  // Create the food item in the database
  const waiter = await Waiter.create({
    name,
    email,
    contact,
    number,
    image: {
      public_id: cloudinaryResponse.public_id,
      url: cloudinaryResponse.secure_url,
    },
  });

  // Send success response
  res.status(201).json({
    success: true,
    message: "Waiter added successfully.",
    data: waiter,
  });
});


  export const getWaiters = catchAsyncErrors(async (req, res, next) => {
    const waiters = await Waiter.find();
    if (!waiters || waiters.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No waiters found.",
      });
    }
  
    res.status(200).json({
      success: true,
      data: waiters,
    });
  });

  
  export const updateWaiter = catchAsyncErrors(async (req, res, next) => {
    const { id } = req.params;
    const { number, email, contact, name } = req.body;
  
    // Combined check for existing waiter with same number, email, or contact (excluding current waiter)
    const existingWaiter = await Waiter.findOne({
      _id: { $ne: id },
      $or: [
        { number },
        { email },
        { contact }
      ]
    });
  
    if (existingWaiter) {
      let field = '';
      if (existingWaiter.number === number) field = 'Number';
      else if (existingWaiter.email === email) field = 'Email';
      else if (existingWaiter.contact === contact) field = 'Contact';
  
      return res.status(400).json({
        success: false,
        message: `Waiter with same ${field} already exists.`,
      });
    }
  
    let waiter = await Waiter.findById(id);
    if (!waiter) {
      return res.status(404).json({
        success: false,
        message: "Waiter not found.",
      });
    }
  
    // Handle image update if present
    if (req.files && req.files.image) {
      const { image } = req.files;
  
      const allowedFormats = ["image/png", "image/jpeg", "image/webp"];
      if (!allowedFormats.includes(image.mimetype)) {
        return next(new ErrorHandler("Image File format not supported.", 400));
      }
  
      await cloudinary.uploader.destroy(waiter.image.public_id);
  
      const cloudinaryResponse = await cloudinary.uploader.upload(
        image.tempFilePath,
        { folder: "BREEZE_BITES" }
      );
  
      if (!cloudinaryResponse || cloudinaryResponse.error) {
        return next(
          new ErrorHandler("Failed to upload food image to Cloudinary.", 500)
        );
      }
  
      waiter.image = {
        public_id: cloudinaryResponse.public_id,
        url: cloudinaryResponse.secure_url,
      };
    }
  
    // Update other fields
    waiter.number = number ?? waiter.number;
    waiter.email = email ?? waiter.email;
    waiter.contact = contact ?? waiter.contact;
    waiter.name = name ?? waiter.name;
  
    await waiter.save();
  
    res.status(200).json({
      success: true,
      message: "Waiter updated successfully.",
      data: waiter,
    });
  });
  
  
  
    export const deleteWaiter = catchAsyncErrors(async (req, res, next) => {
      const { id } = req.params;
    
      // Find the food item by ID
      const waiter = await Waiter.findById(id);
      if (!waiter) {
        return res.status(404).json({
          success: false,
          message: "Waiter not Found",
        });
      }
    
      // Delete item from database
      await Waiter.findByIdAndDelete(id);
    
      res.status(200).json({
        success: true,
        message: "Waiter deleted successfully.",
      });
    });
  
  export const assignWaiter = catchAsyncErrors(async (req, res, next) => {
      const { orderId } = req.params;
      const { waiterIds } = req.body;
    
      try {
        const updatedOrder = await Order.findByIdAndUpdate(
          orderId,
          { waiters: waiterIds },
          { new: true }
        ).populate("waiters");

        res.status(200).json({ 
          success: true, 
          data: updatedOrder 
        });

      } catch (error) {
        res.status(500).json({ 
          success: false, 
          message: "Error assigning waiters" 
        });
      }
    });