import express from "express";
import { saveOrder,getOrders,getOrder,getOrderDelivery,updateOrder,deleteOrder,getCompletedOrders, stripePayment, getOrderDine, stripePaymentDelivery } from "../controllers/orderController.js";

const router = express.Router();
router.get("/getOrders", getOrders);
router.get("/getCompleted/:email", getCompletedOrders);
router.get("/getOrderDelivery/:email", getOrderDelivery);
router.get("/getOrderDine/:email", getOrderDine);
router.get("/getOrder/:email", getOrder);
router.post("/saveOrder", saveOrder);
router.post("/create-order-payment", stripePayment);
router.post("/create-order-payment-delivery", stripePaymentDelivery);

router.put("/updateOrder/:id", updateOrder);
router.delete("/deleteOrder/:id", deleteOrder);
export default router;