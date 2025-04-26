import mongoose from "mongoose";

const bookingSchema = new mongoose.Schema(
    {
        tableNumber: { type: Number, required: true },
        date: { type: String, required: true }, // Format: day-month-year (e.g. 06-04-2025)
        time: { type: String, required: true }, // Time format (e.g. 13:00)
        people: { type: Number },
    },
    { timestamps: true }
);
export const Booking = mongoose.model("bookings", bookingSchema);

