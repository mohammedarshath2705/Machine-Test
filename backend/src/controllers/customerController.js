import csvParser from "csv-parser";
import fs from "fs";
import path from "path";
import Customer from "../models/Customer.js";
import Agent from "../models/Agent.js";

export const uploadCustomers = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const allowedExtensions = [".csv", ".xlsx", ".xls"];
    const ext = path.extname(req.file.originalname).toLowerCase();
    if (!allowedExtensions.includes(ext)) {
      return res
        .status(400)
        .json({ message: "Invalid file type. Only CSV, XLSX, and XLS are allowed." });
    }

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


export const getCustomers = async (req, res) => {
  try {
    const customers = await Customer.find().populate("agent", "name email phone");

    const result = customers.map(c => ({
      _id: c._id,
      FirstName: c.firstName,          // map lowercase DB → uppercase CSV style
      Phone: c.phone,
      Notes: c.notes,
      agentName: c.agent ? c.agent.name : "Unassigned",
    }));

    res.json(result);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



export const getCustomersByAgent = async (req, res) => {
  try {
    const { agentId } = req.params;
    const customers = await Customer.find({ agent: agentId }).populate("agent", "name email phone");
    res.json(customers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
