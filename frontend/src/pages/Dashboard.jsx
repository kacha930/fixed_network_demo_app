// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import Popup from "../components/Popup";
import "./Dashboard.css";

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
    fetch("http://localhost:5000/api/status")
      .then((res) => res.json())
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
      .catch((err) => console.error("Could not fetch status:", err));
    // The cleanup for setTimeout is inside the success branch,
    // so we only return a cleanup function if the timer is set.
  }, []);

  // 🔹 Check if redirected after unlock success
  useEffect(() => {
    if (localStorage.getItem("connectionSuccess") === "true") {
      setShowSuccess(true);
      localStorage.removeItem("connectionSuccess");
      // Hide the success banner after 7 seconds
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