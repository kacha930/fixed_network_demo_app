// src/pages/SimUnlock.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "./SimUnlock.css";

export default function SimUnlock() {
  const [pin, setPin] = useState("");
  const [message, setMessage] = useState("");
  const [simStatus, setSimStatus] = useState("locked");
  const [connection, setConnection] = useState("disconnected");
  const navigate = useNavigate();

  // 🔹 Fetch current SIM status when page loads
  useEffect(() => {
    fetch("http://localhost:5000/api/status")
      .then((res) => res.json())
      .then((data) => {
        setSimStatus(data.sim_status);
        setConnection(data.connection);
      })
      .catch(() => setMessage("⚠️ Unable to reach backend API."));
  }, []);

  // 🔹 Handle PIN submission to Flask API
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("Processing...");
    try {
      const res = await fetch("http://localhost:5000/api/sim/unlock", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ pin }),
      });
      const data = await res.json();
      if (res.ok) {
        setMessage("✅ " + data.message);
        setSimStatus("unlocked");
        setConnection("connected");

        // ✅ Save success flag for dashboard
        localStorage.setItem("connectionSuccess", "true");

        // Redirect after short delay
        setTimeout(() => navigate("/dashboard"), 2000);
      } else {
        setMessage("❌ " + data.message);
      }
    } catch (err) {
      setMessage("⚠️ Network error. Check if Flask is running on port 5000.");
    }
  };

  return (
    <div className="simunlock-container">
      {/* Header */}
      <div className="header">
        <h1>FastMile 5G Gateway 2</h1>
        <span className="nokia-logo">Nokia</span>
      </div>
      {/* Overview Section */}
      <div className="overview-section">
        <h3>Overview</h3>
        <p>
          <strong>SIM Status:</strong> {simStatus}
        </p>
        <p>
          <strong>Connection:</strong> {connection}
        </p>
      </div>
      {/* PIN Entry Form */}
      <form className="pin-form" onSubmit={handleSubmit}>
        <input
          type="password"
          placeholder="Enter PIN"
          value={pin}
          onChange={(e) => setPin(e.target.value)}
          required
        />
        <button type="submit">Submit</button>
      </form>
      {/* Feedback Message */}
      {message && <p className="message">{message}</p>}
    </div>
  );
}