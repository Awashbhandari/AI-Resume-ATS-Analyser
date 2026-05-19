import { useState, useEffect } from "react";
import "../styles/admin.css";

const API = "http://localhost:8080/api/admin";

export default function AdminDashboard({ onLogout, onBack }) {
  const [tab,     setTab]     = useState("overview");
  const [summary, setSummary] = useState(null);
  const [users,   setUsers]   = useState([]);
  const [loading, setLoading] = useState(true);
  const [error,   setError]   = useState("");
  const [mounted, setMounted] = useState(false);
  const [search,  setSearch]  = useState("");

  const token = localStorage.getItem("token");

  const get = async (path) => {
    const res = await fetch(API + path, {
      headers: { Authorization: "Bearer " + token }
    });
    if (!res.ok) throw new Error("Failed: " + res.status);
    return res.json();
  };

  useEffect(() => {
    setTimeout(() => setMounted(true), 40);
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    setError("");
    try {
      const [sumRes, usrRes] = await Promise.all([
        get("/resumes/summary"),
        get("/users")
      ]);
      setSummary(sumRes);
      setUsers(usrRes.data || []);
    } catch (e) {
      setError("Failed to load admin data. Make sure you are logged in as admin.");
    } finally {
      setLoading(false);
    }
  };

  const filteredUsers = users.filter(u =>
    (u.email || "").toLowerCase().includes(search.toLowerCase()) ||
    (u.firstName || "").toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="ad-page">
      {/* Background effects */}
      <div className="ad-orb ad-orb1" />
      <div className="ad-orb ad-orb2" />
      <div className="ad-grid" />

      {/* Nav */}
      <nav className="ad-nav">
        <div className="ad-nav-left">
          <div className="ad-nav-icon">🛡️</div>
          <div>
            <div className="ad-nav-title">Admin Panel</div>
            <div className="ad-nav-sub">AI RESUME ATS ANALYSER</div>
          </div>
        </div>
        <div className="ad-nav-right">
          <button className="ad-nav-btn ad-nav-back" onClick={onBack}>← Back to App</button>
          <button className="ad-nav-btn ad-nav-logout" onClick={onLogout}>Sign Out</button>
        </div>
      </nav>

      <div className={`ad-wrap ${mounted ? "mounted" : ""}`}>

        {/* Header */}
        <div className="ad-header">
          <h1 className="ad-title">Dashboard Overview</h1>
          <p className="ad-subtitle">Monitor users and resume analysis activity</p>
        </div>

        {error && (
          <div className="ad-error">⚠ {error}</div>
        )}

        {loading ? (
          <div className="ad-loading">
            <div className="ad-spinner" />
            <span>Loading admin data...</span>
          </div>
        ) : (
          <>
            {/* Stats Cards */}
            <div className="ad-stats">
              <div className="ad-stat-card ad-stat-green">
                <div className="ad-stat-icon">👥</div>
                <div className="ad-stat-value">{users.length}</div>
                <div className="ad-stat-label">Total Users</div>
              </div>
              <div className="ad-stat-card ad-stat-blue">
                <div className="ad-stat-icon">📄</div>
                <div className="ad-stat-value">{summary?.totalUpload ?? 0}</div>
                <div className="ad-stat-label">Resumes Uploaded</div>
              </div>
              <div className="ad-stat-card ad-stat-purple">
                <div className="ad-stat-icon">✅</div>
                <div className="ad-stat-value">{summary?.atsSuccess ?? 0}</div>
                <div className="ad-stat-label">Successfully Analysed</div>
              </div>
              <div className="ad-stat-card ad-stat-red">
                <div className="ad-stat-icon">❌</div>
                <div className="ad-stat-value">{summary?.atsFailed ?? 0}</div>
                <div className="ad-stat-label">Failed Analysis</div>
              </div>
            </div>

            {/* Tabs */}
            <div className="ad-tabs">
              <button
                className={`ad-tab ${tab === "overview" ? "active" : ""}`}
                onClick={() => setTab("overview")}
              >👥 All Users</button>
              <button
                className={`ad-tab ${tab === "admins" ? "active" : ""}`}
                onClick={() => setTab("admins")}
              >🛡️ Admins Only</button>
            </div>

            {/* Search */}
            <div className="ad-search-wrap">
              <input
                className="ad-search"
                placeholder="🔍  Search by name or email..."
                value={search}
                onChange={e => setSearch(e.target.value)}
              />
              <span className="ad-count">{filteredUsers.length} users</span>
            </div>

            {/* Users Table */}
            <div className="ad-table-wrap">
              <table className="ad-table">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>ID</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredUsers
                    .filter(u => tab === "admins" ? u.role === "ADMIN" : true)
                    .map((u, i) => (
                      <tr key={u.registeredId || i} className="ad-row">
                        <td className="ad-td-num">{i + 1}</td>
                        <td className="ad-td-name">{u.firstName || "—"}</td>
                        <td className="ad-td-email">{u.email}</td>
                        <td>
                          <span className={`ad-badge ${u.role === "ADMIN" ? "ad-badge-admin" : "ad-badge-user"}`}>
                            {u.role === "ADMIN" ? "🛡️ Admin" : "👤 User"}
                          </span>
                        </td>
                        <td className="ad-td-id">{u.registeredId || "—"}</td>
                      </tr>
                    ))}
                  {filteredUsers.length === 0 && (
                    <tr>
                      <td colSpan={5} className="ad-empty">No users found</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>

            {/* Refresh */}
            <div className="ad-footer">
              <button className="ad-refresh" onClick={loadData}>↻ Refresh Data</button>
            </div>
          </>
        )}
      </div>
    </div>
  );
}