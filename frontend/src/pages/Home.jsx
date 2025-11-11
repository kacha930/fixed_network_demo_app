import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import logo from "../assets/nokia-logo.png"; // <-- use your uploaded logo file here

export default function Home() {
  const nav = useNavigate();

  return (
    <div
      className="home-screen"
      style={{
        background: "#E6E6E6", // Grey outer background (like phone mockup padding)
        height: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
        overflow: "hidden",
      }}
    >
      {/* PHONE CONTAINER */}
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="phone-frame"
        style={{
          width: "100%",
          maxWidth: "390px",
          height: "90vh",
          background: "linear-gradient(180deg, #02123B 0%, #031B60 100%)",
          borderRadius: "30px",
          padding: "28px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* ✅ TOP LOGO AREA */}
        <div style={{ textAlign: "center", marginTop: "8px" }}>
          <motion.img
            src={logo}
            alt="Nokia Logo"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              width: "130px",
              marginBottom: "4px",
              filter: "brightness(1.3)",
            }}
          />
        </div>

        {/* 🟦 WiFi RIPPLE ANIMATION */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "10px",
            flexGrow: 1,
            alignItems: "center",
          }}
        >
          <div style={{ position: "relative", width: 160, height: 160 }}>
            {/* Ripple 1 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.4, 0, 0], scale: [0.6, 1.3, 1.6] }}
              transition={{ duration: 2.6, repeat: Infinity, repeatDelay: 0.5 }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "2px solid rgba(128,179,255,0.5)",
              }}
            />
            {/* Ripple 2 */}
            <motion.div
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: [0.4, 0, 0], scale: [0.6, 1.3, 1.6] }}
              transition={{
                duration: 2.6,
                repeat: Infinity,
                repeatDelay: 0.5,
                delay: 1,
              }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                borderRadius: "50%",
                border: "2px solid rgba(128,179,255,0.35)",
              }}
            />
            {/* WiFi Text */}
            <motion.div
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: [0.85, 1, 0.92], opacity: 1 }}
              transition={{ duration: 1.8, repeat: Infinity }}
              style={{
                position: "absolute",
                width: "100%",
                height: "100%",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "#80B3FF",
                fontSize: "32px",
                fontWeight: "700",
                letterSpacing: "2px",
                textShadow: "0 0 12px rgba(128,179,255,0.7)",
                textTransform: "capitalize",
              }}
            >
              WiFi
            </motion.div>
          </div>
        </div>

        {/* 🔘 BUTTONS SECTION */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
            marginBottom: "40px",
          }}
        >
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            onClick={() => nav("/signin")}
            style={{
              width: "80%",
              padding: "12px 0",
              borderRadius: "12px",
              backgroundColor: "#fff",
              color: "#02123B",
              fontSize: "1rem",
              fontWeight: "600",
              border: "none",
              cursor: "pointer",
              boxShadow: "0 4px 10px rgba(255,255,255,0.15)",
              transition: "0.3s",
            }}
            onMouseOver={(e) => (e.target.style.backgroundColor = "#E8EDFF")}
            onMouseOut={(e) => (e.target.style.backgroundColor = "#fff")}
          >
            Sign In
          </motion.button>

          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.9, duration: 0.6 }}
            onClick={() => nav("/get-started")}
            style={{
              width: "80%",
              padding: "12px 0",
              borderRadius: "12px",
              backgroundColor: "transparent",
              border: "1.5px solid #fff",
              color: "#fff",
              fontSize: "1rem",
              fontWeight: "500",
              cursor: "pointer",
              transition: "0.3s",
            }}
            onMouseOver={(e) =>
              (e.target.style.backgroundColor = "rgba(255,255,255,0.1)")
            }
            onMouseOut={(e) => (e.target.style.backgroundColor = "transparent")}
          >
            Get Started
          </motion.button>
        </div>

        {/* 📜 FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 2.4, duration: 0.8 }}
          style={{
            textAlign: "center",
            fontSize: "0.75rem",
            color: "#9CB6E8",
            marginBottom: "8px",
          }}
        >
          © 2025 Nokia WiFi — Smart. Secure. Connected.
        </motion.footer>
      </motion.div>
    </div>
  );
}
