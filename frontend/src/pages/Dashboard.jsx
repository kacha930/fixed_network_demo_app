import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Popup from "../components/Popup";
import "./Dashboard.css";

export default function Dashboard() {
  const nav = useNavigate();
  const [showPopup, setShowPopup] = useState(false);
  const [popupShownOnce, setPopupShownOnce] = useState(false);
  const [activeTab, setActiveTab] = useState("home");
  const [status, setStatus] = useState({
    sim_status: "locked",
    connection: "disconnected",
    operator: null,
    signal_strength: null,
    connection_type: null,
    ip_address: null,
  });
  const [showSuccess, setShowSuccess] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);

  // 🔄 Poll backend every 3 seconds
  useEffect(() => {
    let mounted = true;
    let poll;

    async function fetchStatus() {
      try {
        const res = await fetch("http://localhost:5000/api/status");
        if (!res.ok) throw new Error("Status fetch failed");
        const data = await res.json();
        if (!mounted) return;
        setStatus((prev) => ({ ...prev, ...data }));

        if (data.sim_status === "unlocked") {
          setShowPopup(false);
        }
      } catch (err) {
        console.warn("Could not fetch status:", err);
      }
    }

    fetchStatus();
    poll = setInterval(fetchStatus, 3000);

    return () => {
      mounted = false;
      clearInterval(poll);
    };
  }, []);

  // ✅ Show popup automatically on Home tab when SIM is locked
  useEffect(() => {
    if (status.sim_status === "locked" && activeTab === "home" && !popupShownOnce) {
      setShowPopup(true);
      setPopupShownOnce(true);
    }
  }, [status.sim_status, activeTab, popupShownOnce]);

  // ✅ Connection success banner
  useEffect(() => {
    if (localStorage.getItem("connectionSuccess") === "true") {
      setShowSuccess(true);
      localStorage.removeItem("connectionSuccess");
      const t = setTimeout(() => setShowSuccess(false), 3800);
      return () => clearTimeout(t);
    }
  }, []);

  function logout() {
    localStorage.removeItem("user");
    nav("/signin");
  }

  return (
    <div className="dashboard-root">
      {/* Drawer overlay */}
      <div
        className={`drawer-overlay ${drawerOpen ? "visible" : ""}`}
        onClick={() => setDrawerOpen(false)}
        aria-hidden={!drawerOpen}
      />

      {/* Side Drawer */}
      <aside className={`side-drawer ${drawerOpen ? "open" : ""}`}>
        <div className="drawer-top">
          <div className="drawer-brand">
            <div className="brand-logo"></div>
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
              setActiveTab("network");
              setDrawerOpen(false);
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

          <button className="drawer-item logout" onClick={logout}>
            Logout
          </button>
        </nav>
      </aside>

      {/* Header */}
      <header className="dashboard-header">
        <button
          className={`hamburger ${drawerOpen ? "open" : ""}`}
          onClick={() => setDrawerOpen((v) => !v)}
        >
          <span />
          <span />
          <span />
        </button>

        <div className="header-title">
          <div className="title-main">{status.operator ? status.operator : "Nokia Gateway"}</div>
          <div className="title-sub">
            {status.sim_status === "unlocked"
              ? `${status.operator || "Operator"} — ${status.connection_type || "Connected"}`
              : "WiFi"}
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className={`dashboard-content ${drawerOpen ? "shifted" : ""}`}>
        {showSuccess && <div className="success-banner">✅ Connected successfully</div>}

        {/* Popup on Home */}
        {showPopup && status.sim_status === "locked" && (
          <div className="popup-layer">
            <Popup onClose={() => setShowPopup(false)} />
          </div>
        )}

        <section className="content-area">
          {/* ---------------- HOME TAB ---------------- */}
          {activeTab === "home" && (
            <>
              <h2 className="page-title">Welcome</h2>
              <p className="muted">
                {status.sim_status === "unlocked"
                  ? `Connected to ${status.operator} (${status.connection_type})`
                  : "Smart. Secure. Connected."}
              </p>

              <div className="cards-row">
                <div className="card">
                  <div className="card-title">Connection</div>
                  <div className="card-value">
                    {status.connection === "connected"
                      ? `${status.operator || "Safaricom"} — ${status.connection_type || ""}`
                      : "Disconnected"}
                  </div>
                </div>

                <div className="card">
                  <div className="card-title">SIM</div>
                  <div className="card-value">{status.sim_status}</div>
                </div>
              </div>
            </>
          )}

          {/* ---------------- NETWORK TAB ---------------- */}
          {activeTab === "network" && (
            <>
              <h2 className="page-title">Modem / Network</h2>

              {status.sim_status === "locked" && (
                <div className="info-banner warning">
                  🔒 SIM Locked — limited info. Enter PIN to unlock full features.
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
                <img src="/network-snapshot.png" alt="Network snapshot" className="network-image" />

                <div className="network-details">
                  <div className="detail-row">
                    <div className="detail-label">Operator</div>
                    <div className="detail-value">
                      {status.sim_status === "unlocked"
                        ? status.operator || "Safaricom"
                        : "Searching..."}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">Connection Type</div>
                    <div className="detail-value">
                      {status.sim_status === "unlocked"
                        ? status.connection_type || "-"
                        : "Unavailable"}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">Signal Strength</div>
                    <div className="detail-value">
                      {status.sim_status === "unlocked"
                        ? status.signal_strength || "-"
                        : "N/A"}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">IP Address</div>
                    <div className="detail-value">
                      {status.sim_status === "unlocked"
                        ? status.ip_address || "-"
                        : "Unavailable"}
                    </div>
                  </div>

                  <div className="detail-row">
                    <div className="detail-label">SIM Status</div>
                    <div className="detail-value">
                      {status.sim_status === "locked" ? "PIN Required" : "Safaricom — Connected"}
                    </div>
                  </div>

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

          {/* ---------------- SETTINGS TAB ---------------- */}
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
                  <button className="btn" onClick={() => alert("Save settings (demo)")}>
                    Save
                  </button>
                </div>
              </div>
            </>
          )}
        </section>
      </main>
    </div>
  );
}
