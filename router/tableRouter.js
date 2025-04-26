import express from "express";
import { saveTable, getTables, updateTable,deleteTable } from "../controllers/tableController.js";

const router = express.Router();
router.post("/saveTable", saveTable);
router.get("/getTables", getTables);
router.put("/updateTable/:id", updateTable);
router.delete("/deleteTable/:id", deleteTable);

export default router;