import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import Customer from "../models/Customer.js";
import Agent from "../models/Agent.js";

// 📌 Upload customers from CSV & assign to agents
export const uploadCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    // ✅ File type validation
    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only CSV, XLSX, and XLS are allowed." });
    }

    // ✅ Fetch agents
    const agents = await Agent.find();
    if (agents.length === 0) {
      return res.status(400).json({ message: "No agents found. Please add agents first." });
    }

    const customers = [];
    fs.createReadStream(req.file.path)
      .pipe(csvParser())
      .on("data", (row) => {
        const firstName = row.FirstName || row.Name;
        const phone = row.Phone || row.Mobile;
        const notes = row.Notes || "";

        if (firstName && phone) {
          customers.push({ firstName, phone, notes });
        }
      })
      .on("end", async () => {
        if (customers.length === 0) {
          return res
            .status(400)
            .json({ message: "CSV file is empty or format is incorrect" });
        }

        // ✅ Distribute customers equally among agents (round-robin)
        const distributed = [];
        let agentIndex = 0;

        for (let i = 0; i < customers.length; i++) {
          distributed.push({
            ...customers[i],
            agent: agents[agentIndex]._id,
          });

          agentIndex = (agentIndex + 1) % agents.length; // rotate agents
        }

        await Customer.insertMany(distributed);

        res.status(201).json({
          message: "Customers uploaded & assigned to agents successfully",
          insertedCount: distributed.length,
          agentCount: agents.length,
        });
      });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get all customers with agent info
export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("agent", "name email phone");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 📌 Get customers by specific agent
export const getCustomersByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const customers = await Customer.find({ agent: agentId }).populate("agent", "name email phone");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
