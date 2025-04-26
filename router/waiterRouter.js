import express from "express";
import { assignWaiter, deleteWaiter, getWaiters, saveWaiter, updateWaiter} from "../controllers/waiterController.js";
const router = express.Router();

router.post("/saveWaiter", saveWaiter);
router.get("/getWaiters", getWaiters);
router.put("/updateWaiter/:id", updateWaiter);
router.put("/assignWaiters/:orderId", assignWaiter);
router.delete("/deleteWaiter/:id", deleteWaiter);
export default router;