// src/pages/Dashboard.jsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import "./Dashboard.css";

export default function Dashboard() {
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [status, setStatus] = useState({
    sim_status: "locked",
    connection: "disconnected",
    provider: "Unknown",
    signal: "-",
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch backend status
  useEffect(() => {
    let timer;
    fetch("http://localhost:5000/api/status")
      .then((res) => res.json())
      .then((data) => {
        setStatus((s) => ({ ...s, ...data }));
        if (data.sim_status === "unlocked") {
          setShowPopup(false);
        } else {
          timer = setTimeout(() => setShowPopup(true), 1200);
        }
      })
      .catch((err) => {
        console.warn("Could not fetch status:", err);
        // If fetch fails, still show popup after a short delay for demo
        timer = setTimeout(() => setShowPopup(true), 1200);
      });

    return () => clearTimeout(timer);
  }, []);

  // Show success banner if redirected after unlocking (example)
  useEffect(() => {
    if (localStorage.getItem("connectionSuccess") === "true") {
      setShowSuccess(true);
      localStorage.removeItem("connectionSuccess");
      const t = setTimeout(() => setShowSuccess(false), 3800);
      return () => clearTimeout(t);
    }
  }, []);

  // Helpers
  function logout() {
    localStorage.removeItem("user");
    nav("/signin");
  }

  function openNetworkWithAuth() {
    // Example: require popup (password) before viewing network — mimic your flow
    if (status.sim_status === "locked") {
      setShowPopup(true);
      setDrawerOpen(false);
      return;
    }
    setActiveTab("network");
    setDrawerOpen(false);
  }

  return (
    <div className="dashboard-root">
      {/* overlay when drawer open */}
      <div
        className={`drawer-overlay ${drawerOpen ? "visible" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* side drawer */}
      <aside className={`side-drawer ${drawerOpen ? "open" : ""}`} aria-hidden={!drawerOpen}>
        <div className="drawer-top">
          <div className="drawer-brand">
            <div className="brand-logo">NOKIA</div>
            <div className="brand-sub">WiFi</div>
          </div>
        </div>

        <nav className="drawer-nav">
          <button
            className={activeTab === "home" ? "drawer-item active" : "drawer-item"}
            onClick={() => {
              setActiveTab("home");
              setDrawerOpen(false);
            }}
          >
            Home
          </button>

          <button
            className={activeTab === "network" ? "drawer-item active" : "drawer-item"}
            onClick={() => {
              openNetworkWithAuth();
            }}
          >
            Network
          </button>

          <button
            className={activeTab === "settings" ? "drawer-item active" : "drawer-item"}
            onClick={() => {
              setActiveTab("settings");
              setDrawerOpen(false);
            }}
          >
            Settings
          </button>

          <button
            className="drawer-item logout"
            onClick={() => {
              logout();
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* top header */}
      <header className="dashboard-header">
        <button
          className={`hamburger ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen((v) => !v)}
          aria-label={drawerOpen ? "Close menu" : "Open menu"}
          aria-expanded={drawerOpen}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="header-title">
          <div className="title-main">Nokia</div>
          <div className="title-sub">WiFi</div>
        </div>
      </header>

      {/* main content */}
      <main className={`dashboard-content ${drawerOpen ? "shifted" : ""}`}>
        {/* success banner */}
        {showSuccess && <div className="success-banner">✅ Connected successfully</div>}

        {/* popup (your existing popup sits above everything) */}
        {showPopup && status.sim_status === "locked" && (
          <div className="popup-layer">
            <Popup onClose={() => setShowPopup(false)} />
          </div>
        )}

        {/* content per tab */}
        <section className="content-area">
          {activeTab === "home" && (
            <>
              <h2 className="page-title">Welcome</h2>
              <p className="muted">Smart. Secure. Connected.</p>

              <div className="cards-row">
                <div className="card">
                  <div className="card-title">Connection</div>
                  <div className="card-value">{status.connection}</div>
                </div>

                <div className="card">
                  <div className="card-title">SIM</div>
                  <div className="card-value">{status.sim_status}</div>
                </div>
              </div>
            </>
          )}

          {activeTab === "network" && (
            <>
              <h2 className="page-title">Modem / Network</h2>

              {/* NOTE: place a snapshot image in public/network-snapshot.png or update src */}
              <div className="network-card">
                <img
                  src="/network-snapshot.png"
                  alt="Network snapshot"
                  className="network-image"
                />

                <div className="network-details">
                  <div className="detail-row">
                    <div className="detail-label">Data Connection</div>
                    <div className="detail-value">Connected</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">State</div>
                    <div className="detail-value">{status.provider || "VodaCom-SA; 4G+"}</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">SIM Card Info</div>
                    <div className="detail-value">SIM 1 (Ready)</div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">Signal</div>
                    <div className="detail-value">{status.signal || "-65 dBm"}</div>
                  </div>

                  <div className="network-actions">
                    <button className="btn small" onClick={() => alert("Change network (demo)")}>Change</button>
                    <button className="btn outline small" onClick={() => alert("Advanced (demo)")}>Advanced</button>
                  </div>
                </div>
              </div>
            </>
          )}

          {activeTab === "settings" && (
            <>
              <h2 className="page-title">Settings</h2>
              <div className="settings-list">
                <label className="setting-row">
                  <span>Auto-connect</span>
                  <input type="checkbox" defaultChecked />
                </label>

                <label className="setting-row">
                  <span>Save networks</span>
                  <input type="checkbox" />
                </label>

                <div style={{ marginTop: 12 }}>
                  <button className="btn" onClick={() => alert("Save settings (demo)")}>Save</button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
