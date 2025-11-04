// src/components/Popup.jsx
import React from "react";
import "./Popup.css";

export default function Popup({ onClose }) {
  return (
    <div className="popup-banner">
      <p className="popup-text">
        ⚠️ Your SIM may be locked,&nbsp;
        <span className="highlight">open WebUI</span> to unlock and manage your connection.
      </p>

      <div className="popup-buttons">
        <button
          className="popup-btn webui"
          onClick={() => window.open("http://localhost:5173/simunlock", "_blank")}
        >
          Open WebUI
        </button>
        <button className="popup-btn close" onClick={onClose}>
          ✕
        </button>
      </div>
    </div>
  );
}
