import { useEffect, useState } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";

interface Agent {
  id: string;
  name: string;
  email: string;
  mobile: string;
}

export default function Agent() {
  const [agents, setAgents] = useState<Agent[]>([]);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState<{ type: "success" | "error"; text: string } | null>(null);

  
  const fetchAgents = async () => {
    try {
      const res = await api.get("/agents");
      setAgents(res.data);
    } catch (err) {
      console.error(err);
      setMessage({ type: "error", text: "Failed to load agents." });
    }
  };

  useEffect(() => {
    fetchAgents();
  }, []);

  
  const addAgent = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post("/agents", { name, email, mobile, password });
      setMessage({ type: "success", text: "Agent added successfully!" });

      
      setName("");
      setEmail("");
      setMobile("");
      setPassword("");

      
      fetchAgents();
    } catch (err: any) {
      console.error(err);
      setMessage({ type: "error", text: err.response?.data?.message || "Failed to add agent." });
    }
  };

  
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-blue-200/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8"
    >
      
      {message && (
        <div
          className={`mb-4 p-3 rounded-lg text-white font-medium shadow-md ${
            message.type === "success" ? "bg-green-500" : "bg-red-500"
          }`}
        >
          {message.text}
        </div>
      )}

      
      <form
        onSubmit={addAgent}
        className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4"
      >
        <input
          type="text"
          placeholder="Agent Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="border border-blue-300/50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20"
          required
        />
        <input
          type="email"
          placeholder="Agent Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="border border-blue-300/50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20"
          required
        />
        <input
          type="tel"
          placeholder="+91 9876543210"
          value={mobile}
          onChange={(e) => setMobile(e.target.value)}
          className="border border-blue-300/50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20"
          required
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="border border-blue-300/50 px-4 py-2 rounded-lg focus:ring-2 focus:ring-blue-400 outline-none bg-white/20"
          required
        />
        <button
          type="submit"
          className="col-span-1 md:col-span-2 bg-blue-600/80 text-white px-6 py-2 rounded-lg hover:bg-blue-700/90 transition w-full md:w-auto mx-auto"
        >
          Add Agent
        </button>
      </form>

      
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Agents List
      </h3>
      {agents.length === 0 ? (
        <p className="text-gray-700">No agents found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {agents.map((agent) => (
            <motion.div
              key={agent.id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 border border-blue-300/40 rounded-lg bg-blue-100/50 backdrop-blur-md hover:bg-blue-100/60 shadow-sm"
            >
              <p className="font-medium text-gray-800">{agent.name}</p>
              <p className="text-sm text-gray-700">{agent.email}</p>
              <p className="text-sm text-gray-700">{agent.mobile}</p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
