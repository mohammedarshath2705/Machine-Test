import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes.js";
import agentRoutes from "./routes/agentRoutes.js";
import customerRoutes from "./routes/customerRoutes.js";

const app = express();

app.use(cors({
  origin: "https://machine-test-flax.vercel.app", // React app URL
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "OPTIONS"],
  credentials: true,
}));


app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/agents", agentRoutes);
app.use("/api/customers", customerRoutes);

export default app;
