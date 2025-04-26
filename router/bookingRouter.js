import express from "express";
import { saveBooking, getBookings } from "../controllers/bookingController.js";

const router = express.Router();
router.get("/getBookings", getBookings);
router.post("/saveBooking", saveBooking);
export default router;