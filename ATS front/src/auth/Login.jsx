import { useState, useEffect } from "react";
import "../styles/login.css";

export default function Login({ onLogin, onGoRegister }) {
  const [form,    setForm]    = useState({ email: "", password: "" });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState({});
  const [loading, setLoading] = useState(false);
  const [showPw,  setShowPw]  = useState(false);
  const [alert,   setAlert]   = useState("");
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  const validate = (f) => {
    const e = {};
    if (!f.email)                          e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email)) e.email  = "Enter a valid email";
    if (!f.password)                       e.password = "Password is required";
    else if (f.password.length < 6)        e.password = "At least 6 characters";
    return e;
  };

  const change = (k, v) => {
    const next = { ...form, [k]: v };
    setForm(next);
    if (touched[k]) setErrors(validate(next));
  };

  const blur = (k) => {
    setTouched(t => ({ ...t, [k]: true }));
    setFocused(f => ({ ...f, [k]: false }));
    setErrors(validate(form));
  };

  const submit = async () => {
    setTouched({ email: true, password: true });
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setAlert("");
    try {
      const res  = await fetch("http://localhost:8080/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      });
      const data = await res.json();
const token = data.accessToken || data.token || data;
if (token && token.toString().startsWith("ey")) {
    localStorage.setItem("token", token);
    onLogin();
} else {
    setAlert("Invalid email or password.");
}
    } catch {
      setAlert("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="ln-page">
      <div className="ln-orb ln-orb1" />
      <div className="ln-orb ln-orb2" />
      <div className="ln-grid" />

      <div className={`ln-wrap ${mounted ? "mounted" : ""}`}>
        {/* Brand */}
        <div className="ln-brand">
          <div className="ln-brand-icon">🎯</div>
          <div className="ln-brand-name">ATS Analyzer</div>
          <div className="ln-brand-sub">AI RESUME ATS ANALYZER</div>
        </div>

        {/* Card */}
        <div className="ln-card">
          <div className="ln-heading">
            <h1>Welcome back</h1>
            <p>Sign in to analyze your resume</p>
          </div>

          {alert && (
            <div className="ln-alert">
              <span>⚠</span>
              <span>{alert}</span>
            </div>
          )}

          {/* Email Field */}
<div className="ln-field">
  <label className={`ln-label ${focused.email ? "focused" : ""} ${touched.email && errors.email ? "errored" : ""}`}>
    📧 Email Address
  </label>
  <div className="ln-input-wrap">
    <input
      className={`ln-input ${focused.email ? "focused" : ""} ${touched.email && errors.email ? "errored" : ""}`}
      type="email"
      value={form.email}
      onChange={e => change("email", e.target.value)}
      onFocus={() => setFocused(f => ({ ...f, email: true }))}
      onBlur={() => blur("email")}
      onKeyDown={e => e.key === "Enter" && submit()}
      placeholder="you@example.com"
      autoComplete="email"
    />
  </div>
  {touched.email && errors.email && (
    <div className="ln-field-err">⚠ {errors.email}</div>
  )}
</div>

{/* Password Field */}
<div className="ln-field">
  <label className={`ln-label ${focused.password ? "focused" : ""} ${touched.password && errors.password ? "errored" : ""}`}>
    🔒 Password
  </label>
  <div className="ln-input-wrap">
    <input
      className={`ln-input has-toggle ${focused.password ? "focused" : ""} ${touched.password && errors.password ? "errored" : ""}`}
      type={showPw ? "text" : "password"}
      value={form.password}
      onChange={e => change("password", e.target.value)}
      onFocus={() => setFocused(f => ({ ...f, password: true }))}
      onBlur={() => blur("password")}
      onKeyDown={e => e.key === "Enter" && submit()}
      placeholder="••••••••"
      autoComplete="current-password"
    />
    <button className="ln-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
      {showPw ? "🙈" : "👁"}
    </button>
  </div>
  {touched.password && errors.password && (
    <div className="ln-field-err">⚠ {errors.password}</div>
  )}
</div>

          <button className="ln-btn" onClick={submit} disabled={loading}>
            {loading ? <span className="ln-spinner" /> : null}
            {loading ? "Signing in…" : "Sign In →"}
          </button>

          <div className="ln-switch">
            Don't have an account?{" "}
            <button className="ln-switch-btn" onClick={onGoRegister}>
              Create one
            </button>
          </div>
        </div>

        <div className="ln-footer">© 2025 · AI Resume ATS Analyzer · BSc CSIT Project</div>
      </div>
    </div>
  );
}
