import { useRef } from "react";
import Navbar from "../components/Navbar";
import Agent from "./Agent";
import Customer from "./Customer";
import { motion } from "framer-motion";

export default function Dashboard() {
  const agentRef = useRef<HTMLDivElement>(null);
  const customerRef = useRef<HTMLDivElement>(null);

  const scrollToAgent = () =>
    agentRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  const scrollToCustomer = () =>
    customerRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-gradient-to-r from-blue-200 via-green-200 to-indigo-200 animate-gradient-x" />

      <div className="absolute top-20 left-10 w-80 h-80 bg-green-300/40 rounded-full blur-3xl animate-pulse" />
      <div className="absolute bottom-32 right-10 w-80 h-80 bg-blue-300/40 rounded-full blur-3xl animate-pulse delay-1000" />
      <div className="absolute top-1/2 left-1/3 w-72 h-72 bg-indigo-300/30 rounded-full blur-3xl animate-pulse delay-700" />

      <Navbar
        onScrollToAgent={scrollToAgent}
        onScrollToCustomer={scrollToCustomer}
      />

      <div className="container mx-auto px-4 md:px-8 pt-24 pb-16 text-gray-800">
        <motion.section
          ref={agentRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="py-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Agent Management
          </h2>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
            <Agent />
          </div>
        </motion.section>

        <motion.section
          ref={customerRef}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          viewport={{ once: true }}
          className="py-10"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-8 text-center">
            Customer Management
          </h2>
          <div className="bg-white/70 backdrop-blur-xl rounded-2xl shadow-xl p-6 md:p-8 hover:shadow-2xl transition-all duration-300">
            <Customer />
          </div>
        </motion.section>
      </div>
    </div>
  );
}
