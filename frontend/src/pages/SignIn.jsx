import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./SignIn.css"; // ✅ Import external CSS file

export default function SignIn() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const nav = useNavigate();

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ username, password }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        localStorage.setItem("user", JSON.stringify(data));
        nav("/dashboard");
      } else {
        setError(data.message || "Invalid credentials");
      }
    } catch (err) {
      setError("Backend not reachable");
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="signin-container"
    >
      {/* Header */}
      <h1 className="signin-title">Sign In</h1>

      {/* Card */}
      <div className="signin-card">
        <form onSubmit={handleSubmit} className="signin-form">
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            className="signin-input"
          />

          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="signin-input"
          />

          <button type="submit" className="signin-button">
            Sign In
          </button>
        </form>

        {error && <p className="signin-error">{error}</p>}
      </div>

      {/* Footer */}
      <p className="signin-footer">
        © 2025 Nokia WiFi — Smart. Secure. Connected.
      </p>
    </motion.div>
  );
}
