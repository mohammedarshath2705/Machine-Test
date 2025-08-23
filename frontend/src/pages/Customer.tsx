import { useEffect, useState, useRef } from "react";
import api from "../api/axios";
import { motion } from "framer-motion";

interface Customer {
  id?: string;
  FirstName?: string;
  Phone?: string;
  Notes?: string;
  agentName?: string;
}

export default function Customer() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  // Fetch customers
  useEffect(() => {
    api
      .get("/customers")
      .then((res) => setCustomers(res.data))
      .catch((err) => console.error(err));
  }, []);

  // Handle file selection & auto-upload
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      setUploading(true);
      const res = await api.post("/customers/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      setCustomers([...customers, ...res.data]); // append new customers
    } catch (err) {
      console.error(err);
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = ""; // reset file input
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      viewport={{ once: true }}
      className="bg-blue-200/50 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8"
    >
      {/* Upload CSV */}
      <div className="mb-8 flex justify-center">
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={uploading}
          className="bg-green-600/80 text-white px-6 py-2 rounded-lg hover:bg-green-700/90 transition"
        >
          {uploading ? "Uploading..." : "📂 Upload CSV"}
        </button>
        <input
          type="file"
          ref={fileInputRef}
          accept=".csv,.xlsx,.xls"
          className="hidden"
          onChange={handleFileChange}
        />
      </div>

      {/* Customers List */}
      <h3 className="text-xl font-semibold text-gray-800 mb-4">
        Customers List
      </h3>

      {customers.length === 0 ? (
        <p className="text-gray-700">No customers found.</p>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {customers.map((c, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
              className="p-4 border border-blue-300/40 rounded-lg bg-blue-100/50 backdrop-blur-md hover:bg-blue-100/60 shadow-sm"
            >
              <p className="font-medium text-gray-800">
                {c.FirstName || "Unknown"}
              </p>
              <p className="text-sm text-gray-700">{c.Phone || "No phone"}</p>
              <p className="text-sm text-gray-700">{c.Notes || "No notes"}</p>
              <p className="text-sm text-blue-700">
                Agent: {c.agentName || "Unassigned"}
              </p>
            </motion.div>
          ))}
        </div>
      )}
    </motion.div>
  );
}
