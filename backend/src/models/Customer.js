import mongoose from "mongoose";

const customerSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true },
    phone: { type: String, required: true },
    notes: { type: String },
    agent: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" }, // 🔑 assigned agent
  },
  { timestamps: true }
);

const Customer = mongoose.model("Customer", customerSchema);
export default Customer;
