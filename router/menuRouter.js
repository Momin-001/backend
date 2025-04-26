import express from "express";
import { deleteItem, saveItem, updateItem,getItems } from "../controllers/menuController.js";

const router = express.Router();

router.post("/addFood", saveItem);
router.get("/getFood", getItems);
router.put("/updateFood/:id", updateItem);
router.delete("/deleteFood/:id", deleteItem);
export default router;