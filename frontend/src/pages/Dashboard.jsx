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
    provider: null,
    signal: null,
    network_mode: null,
    ip_address: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // Fetch backend status (polling every 3s)
  useEffect(() => {
    let mounted = true;
    let poll;

    async function fetchStatus() {
      try {
        const res = await fetch("http://localhost:5000/api/status");
        if (!res.ok) throw new Error("Status fetch failed");
        const data = await res.json();
        if (!mounted) return;

        // Merge fields safely
        setStatus((s) => ({ ...s, ...data }));

        // If SIM locked, keep popup off until user triggers it; we still show limited network info
        if (data.sim_status === "unlocked") {
          setShowPopup(false);
        }
      } catch (err) {
        console.warn("Could not fetch status:", err);
      }
    }

    // initial fetch and poll
    fetchStatus();
    poll = setInterval(fetchStatus, 3000);

    return () => {
      mounted = false;
      clearInterval(poll);
    };
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

  // Allow opening network view regardless of SIM status.
  // Network UI itself will show limited data and disable controls if SIM locked.
  function openNetworkWithAuth() {
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

              {/* show locked banner when sim locked */}
              {status.sim_status === "locked" && (
                <div className="info-banner warning" role="status">
                  🔒 SIM Locked — limited network information available. Enter PIN to unlock full features.
                  <button
                    className="btn small"
                    style={{ marginLeft: 8 }}
                    onClick={() => setShowPopup(true)}
                  >
                    Unlock SIM
                  </button>
                </div>
              )}

              <div className="network-card">
                <img
                  src="/network-snapshot.png"
                  alt="Network snapshot"
                  className="network-image"
                />

                <div className="network-details">
                  <div className="detail-row">
                    <div className="detail-label">Data Connection</div>
                    <div className="detail-value">
                      {status.sim_status === "locked"
                        ? "Unavailable (SIM Locked)"
                        : status.connection}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">State</div>
                    <div className="detail-value">
                      {/* If operator is provided by backend show it, otherwise show network_mode or searching */}
                      {status.sim_status === "unlocked"
                        ? (status.provider || status.operator || "Operator")
                        : (status.network_mode ? `${status.network_mode} (searching)` : "Searching…")}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">SIM Card Info</div>
                    <div className="detail-value">
                      {status.sim_status === "locked" ? "PIN required" : "SIM 1 (Ready)"}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">Signal</div>
                    <div className="detail-value">
                      {typeof status.signal === "number" ? `${status.signal} dBm` : (status.signal || "-")}
                    </div>
                  </div>

                  {status.sim_status === "unlocked" && status.ip_address && (
                    <div className="detail-row">
                      <div className="detail-label">IP Address</div>
                      <div className="detail-value">{status.ip_address}</div>
                    </div>
                  )}

                  <div className="network-actions">
                    <button
                      className="btn small"
                      disabled={status.sim_status === "locked"}
                      onClick={() => alert("Change network (demo)")}
                    >
                      Change
                    </button>
                    <button
                      className="btn outline small"
                      disabled={status.sim_status === "locked"}
                      onClick={() => alert("Advanced (demo)")}
                    >
                      Advanced
                    </button>
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
