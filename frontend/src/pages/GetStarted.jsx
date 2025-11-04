import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function GetStarted(){
  const navigate = useNavigate();
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="min-h-screen bg-[#02123B] text-white flex flex-col justify-center items-center"
    >
      <h1 className="text-3xl font-bold mb-4">Get Started</h1>
      <p className="text-center text-gray-400 mb-6">(This page could guide users through WiFi setup)</p>
      <button onClick={() => navigate('/')} className="mt-4 bg-white text-[#02123B] px-6 py-2 rounded-lg font-medium">Back to Home</button>
    </motion.div>
  );
}
