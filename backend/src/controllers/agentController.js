import Agent from "../models/Agent.js";
import Customer from "../models/Customer.js";

export const addAgent = async (req, res) => {
  try {
    const { name, email, mobile, password } = req.body;

    if (!name || !email || !mobile || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const exists = await Agent.findOne({ $or: [{ email }, { mobile }] });
    if (exists) {
      return res
        .status(400)
        .json({ message: "Agent with this email or mobile already exists" });
    }

    const agent = await Agent.create({ name, email, mobile, password });

    res.status(201).json({
      _id: agent._id,
      name: agent.name,
      email: agent.email,
      mobile: agent.mobile,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

export const getAgents = async (req, res) => {
  try {
    const agents = await Agent.find().select("-password"); 
    res.json(agents);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyCustomers = async (req, res) => {
  try {
    const customers = await Customer.find({ agent: req.user._id });
    res.json(customers);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};
