import express from "express";
import { addAgent, getAgents ,getMyCustomers} from "../controllers/agentController.js";
import { protect} from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/", protect, addAgent);
router.get("/", protect, getAgents);
router.get("/me/customers", protect, getMyCustomers);


export default router;
