import { catchAsyncErrors } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../middlewares/error.js";
import { Booking } from "../models/bookingSchema.js";
import { Order } from "../models/orderSchema.js";
import { stripe } from "../server.js";

export const saveBooking = catchAsyncErrors(async (req, res, next) => {
    try {
      const { time, date, tableNumber, people } = req.body;
      
      // ✅ Validate required fields
      if (!time || !date || !tableNumber || !people) {
        return next(new ErrorHandler("Please fill all required fields.", 400));
      }
  
      // ✅ Create Order in Database
      const booking = await Booking.create({
        time,
        date,
        tableNumber,
        people
      });
  
      res.status(201).json({
        success: true,
        message: "Booked successfully.",
        data: booking,
      });
    } catch (error) {
      console.error("Server Error:", error); // Log error for debugging
      return next(new ErrorHandler(error.message, 500));
    }
  });
  
  export const getBookings = catchAsyncErrors(async (req, res, next) => {
    // Retrieve all food items from the database
    const bookings = await Booking.find();
    // Check if any items exist
    if (!bookings || bookings.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No bookings found.",
      });
    }
  
    // Send the food items in the response
    res.status(200).json({
      success: true,
      data: bookings,
    });
  });

//   export const getCompletedOrders = catchAsyncErrors(async (req, res, next) => {
//     const {email} =req.params
//     const orderCompleted = await Order.find({email, status:"Completed"});
//     console.log(orderCompleted);  
  
//     // Send the food items in the response
//     res.status(200).json({
//       success: true,
//       data: orderCompleted
//     });
//   });

//   export const updateOrder = catchAsyncErrors(async (req, res, next) => {
//     const { id } = req.params; // Get the menu item ID from the request
//     const {status} = req.body;
  
//     // Find the item in the database
//     let order = await Order.findById(id);
//     if (!order) {
//       return next(new ErrorHandler("Order not found.", 404));
//     }
  
//     order.status = status ? status : order.status;
//     // Save updated food item
//     await order.save();
  
//     res.status(200).json({
//       success: true,
//       message: "Order updated successfully.",
//       data: order,
//     });
//   });


//   export const deleteOrder = catchAsyncErrors(async (req, res, next) => {
//     const { id } = req.params;
  
//     // Find the food item by ID
//     const order = await Order.findById(id);
//     if (!order) {
//       return next(new ErrorHandler("Order not found.", 404));
//     }
  
//     // Delete item from database
//     await Order.findByIdAndDelete(id);
  
//     res.status(200).json({
//       success: true,
//       message: "Order deleted successfully.",
//     });
//   });

//   export const stripePayment = catchAsyncErrors(async (req, res, next) => {
//     const {CartPrice} =req.body
//     const customer = await stripe.customers.create();
//     const ephemeralKey = await stripe.ephemeralKeys.create(
//       {customer: customer.id},
//       {apiVersion: '2025-03-31.basil'}
//     );
//     const paymentIntent = await stripe.paymentIntents.create({
//       amount: CartPrice * 100,
//       currency: 'pkr',
//       customer: customer.id,
//     });
  
//     res.json({
//       paymentIntent: paymentIntent.client_secret,
//       ephemeralKey: ephemeralKey.secret,
//       customer: customer.id,
//       publishableKey: process.env.STRIPE_PUBLISHABLE_KEY
//     });
//   });
  