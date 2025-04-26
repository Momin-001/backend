import express from "express";
import { saveUser, updateUser, getUser} from "../controllers/userController.js";
const router = express.Router();

router.post("/saveuser", saveUser);
router.post("/updateuser/:email", updateUser);
router.get("/getuser/:email", getUser);

export default router;