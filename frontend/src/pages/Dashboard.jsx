// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Popup from "../components/Popup";
import "./Dashboard.css";

// 🚀 Define API_URL using the environment variable
const API_URL = process.env.REACT_APP_API_URL; 

export default function Dashboard() {
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [status, setStatus] = useState({
    sim_status: "locked",
    connection: "disconnected",
  });
  const [showSuccess, setShowSuccess] = useState(false);

  // 🔹 Fetch real backend status on load & manage initial popup
  useEffect(() => {
    // 🔗 Fetches from the live Render URL
    fetch(`${API_URL}/api/status`) 
      .then((res) => {
        if (!res.ok) throw new Error("Failed to fetch status");
        return res.json();
      })
      .then((data) => {
        setStatus(data);

        // ✅ If unlocked, hide popup; otherwise set timer for popup
        if (data.sim_status === "unlocked") {
          setShowPopup(false);
        } else {
          const timer = setTimeout(() => setShowPopup(true), 2000);
          return () => clearTimeout(timer);
        }
      })
      .catch((err) => {
        // More descriptive error message for the console
        console.error("Could not fetch status from API:", err); 
        // Optional: Update state to show connection failure to user
        setStatus({ sim_status: "Error", connection: "API Down" });
      });
  }, []);

  // 🔹 Check if redirected after unlock success
  useEffect(() => {
    if (localStorage.getItem("connectionSuccess") === "true") {
      setShowSuccess(true);
      localStorage.removeItem("connectionSuccess");
      // Hide the success banner after 4 seconds
      const timer = setTimeout(() => setShowSuccess(false), 4000);
      return () => clearTimeout(timer);
    }
  }, []);

  return (
    <div className="dashboard-container">
      {/* ✅ Success banner */}
      {showSuccess && (
        <div className="success-banner">
          ✅ Connected successfully
        </div>
      )}

      {/* ✅ Popup only if SIM locked */}
      {showPopup && status.sim_status === "locked" && (
        <Popup onClose={() => setShowPopup(false)} />
      )}

      <div className="dashboard-header">
        <h1>Nokia</h1>
        <p>WIFI</p>
        <p>Smart. Secure. Connected.</p>
      </div>

      <div className="dashboard-content">
        <h2>Welcome Home</h2>
        {/* Display Status */}
        <div className="status-display">
          <p>
            <strong>SIM Status:</strong> {status.sim_status}
          </p>
          <p>
            <strong>Connection:</strong> {status.connection}
          </p>
        </div>
      </div>

      <nav className="dashboard-nav">
        <button
          className={activeTab === "home" ? "active" : ""}
          onClick={() => setActiveTab("home")}
        >
          🏠 Home
        </button>
        <button
          className={activeTab === "devices" ? "active" : ""}
          onClick={() => setActiveTab("devices")}
        >
          📶 Devices
        </button>
        <button
          className={activeTab === "settings" ? "active" : ""}
          onClick={() => setActiveTab("settings")}
        >
          ⚙️ Settings
        </button>
        <button className="logout" onClick={() => localStorage.removeItem("user")}>
          🚪 Logout
        </button>
      </nav>
    </div>
  );
}