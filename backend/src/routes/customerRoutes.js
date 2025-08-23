import express from "express";
import { upload } from "../middleware/uploadMiddleware.js";
import { getCustomers, getCustomersByAgent, uploadCustomers } from "../controllers/customerController.js";
import { protect } from "../middleware/authMiddleware.js";  // ✅ import protect

const router = express.Router();

router.post("/upload", protect, upload.single("file"), uploadCustomers);
router.get("/",protect,getCustomers);
router.get("/agent/:agentId", protect, getCustomersByAgent);


export default router;
