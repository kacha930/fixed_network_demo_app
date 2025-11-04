import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";

export default function Home() {
  const nav = useNavigate();

  return (
    <div
      className="home-screen"
      style={{
        background: "linear-gradient(180deg, #02123B 0%, #031B60 100%)",
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "Inter, sans-serif",
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
          minHeight: "700px",
          background: "rgba(255,255,255,0.05)",
          borderRadius: "30px",
          padding: "40px 20px",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          boxShadow: "0 0 20px rgba(0,0,0,0.3)",
          position: "relative",
        }}
      >
        {/* TOP LOGO AREA */}
        <div
          style={{
            textAlign: "center",
            marginTop: "60px",
          }}
        >
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.7 }}
            style={{
              fontSize: "2.5rem",
              fontWeight: "700",
              color: "#fff",
              letterSpacing: "1.5px",
            }}
          >
            Nokia
          </motion.h1>

          <motion.h2
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{
              delay: 1.0,
              duration: 0.8,
            }}
            style={{
              fontSize: "1.6rem",
              fontWeight: "500",
              color: "#80B3FF",
              marginTop: "8px",
              textShadow: "0 0 10px rgba(128,179,255,0.5)",
            }}
          >
            WiFi
          </motion.h2>
        </div>

        {/* BUTTONS SECTION */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: "14px",
          }}
        >
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 1.8, duration: 0.6 }}
            onClick={() => nav("/signin")}
            style={{
              width: "80%",
              padding: "14px 0",
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
            transition={{ delay: 2.4, duration: 0.6 }}
            onClick={() => nav("/get-started")}
            style={{
              width: "80%",
              padding: "14px 0",
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

        {/* FOOTER */}
        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 3.0, duration: 0.8 }}
          style={{
            textAlign: "center",
            fontSize: "0.8rem",
            color: "#9CB6E8",
            marginBottom: "20px",
          }}
        >
          © 2025 Nokia WiFi — Smart. Secure. Connected.
        </motion.footer>
      </motion.div>
    </div>
  );
}
