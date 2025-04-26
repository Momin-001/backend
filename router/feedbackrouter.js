import express from "express";
import { savefeedback, getfeedbacks, sendEmail, updatefeedback } from "../controllers/feedbackController.js";

const router = express.Router();

router.post("/savefeedback", savefeedback);
router.get("/getfeedbacks", getfeedbacks);
router.post("/sendemail", sendEmail)
router.put("/updatefeedback/:id", updatefeedback)

export default router;

