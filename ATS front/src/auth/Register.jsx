import { useState, useEffect } from "react";
import "../styles/register.css";
import theme from "../styles/theme";

const strength = (pw) => {
  let s = 0;
  if (pw.length >= 6)          s++;
  if (/[0-9]/.test(pw))        s++;
  if (/[A-Z]/.test(pw))        s++;
  if (pw.length >= 10)         s++;
  return s;
};

const STRENGTH_LABELS = ["", "Weak", "Fair", "Good", "Strong"];
const STRENGTH_COLORS = ["", theme.strengthWeak, theme.strengthFair, theme.strengthGood, theme.strengthGreat];

export default function Register({ onSuccess, onGoLogin }) {
  const [form,    setForm]    = useState({ name: "", email: "", password: "", confirm: "" });
  const [errors,  setErrors]  = useState({});
  const [touched, setTouched] = useState({});
  const [focused, setFocused] = useState({});
  const [showPw,  setShowPw]  = useState(false);
  const [loading, setLoading] = useState(false);
  const [alert,   setAlert]   = useState("");
  const [success, setSuccess] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setTimeout(() => setMounted(true), 40); }, []);

  const pw = form.password;
  const pwStrength = strength(pw);

  const validate = (f) => {
    const e = {};
    if (!f.name.trim())                         e.name     = "Name is required";
    if (!f.email)                               e.email    = "Email is required";
    else if (!/\S+@\S+\.\S+/.test(f.email))     e.email    = "Enter a valid email";
    if (!f.password)                            e.password = "Password is required";
    else if (f.password.length < 6)             e.password = "At least 6 characters";
    if (!f.confirm)                             e.confirm  = "Please confirm password";
    else if (f.confirm !== f.password)          e.confirm  = "Passwords do not match";
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
    const all = { name: true, email: true, password: true, confirm: true };
    setTouched(all);
    const e = validate(form);
    setErrors(e);
    if (Object.keys(e).length) return;
    setLoading(true);
    setAlert("");
    try {
      const res  = await fetch("http://localhost:8080/api/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name: form.name, email: form.email, password: form.password }),
      });
      const text = await res.text();
      if (res.ok || text.toLowerCase().includes("success")) {
        setSuccess(true);
        setTimeout(() => onSuccess(), 2000);
      } else {
        setAlert(text || "Registration failed. Try a different email.");
      }
    } catch {
      setAlert("Cannot connect to server. Make sure the backend is running.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="rg-page">
      <div className="rg-orb rg-orb1" />
      <div className="rg-orb rg-orb2" />
      <div className="rg-grid" />

      <div className={`rg-wrap ${mounted ? "mounted" : ""}`}>
        {/* Brand */}
        <div className="rg-brand">
          <div className="rg-brand-icon">🎯</div>
          <div className="rg-brand-name">ATS Analyzer</div>
          <div className="rg-brand-sub">AI RESUME ATS ANALYZER</div>
        </div>

        {/* Card */}
        <div className="rg-card">
          {success && (
            <div className="rg-success">
              <div className="rg-success-icon">✓</div>
              <div className="rg-success-title">Account Created!</div>
              <div className="rg-success-sub">Redirecting to login…</div>
            </div>
          )}

          <div className="rg-heading">
            <h1>Create Account</h1>
            <p>Start analyzing your resume today</p>
          </div>

          {alert && (
            <div className="rg-alert"><span>⚠</span><span>{alert}</span></div>
          )}

          {/* Name Field */}
<div className="rg-field">
  <label className={`rg-label ${focused.name ? "focused" : ""} ${touched.name && errors.name ? "errored" : ""}`}>
    👤 Full Name
  </label>
  <div className="rg-input-wrap">
    <input
      className={`rg-input ${focused.name ? "focused" : ""} ${touched.name && errors.name ? "errored" : ""}`}
      type="text"
      value={form.name}
      onChange={e => change("name", e.target.value)}
      onFocus={() => setFocused(f => ({ ...f, name: true }))}
      onBlur={() => blur("name")}
      onKeyDown={e => e.key === "Enter" && submit()}
      placeholder="Your full name"
      autoComplete="name"
    />
  </div>
  {touched.name && errors.name && (
    <div className="rg-field-err">⚠ {errors.name}</div>
  )}
</div>

{/* Email Field */}
<div className="rg-field">
  <label className={`rg-label ${focused.email ? "focused" : ""} ${touched.email && errors.email ? "errored" : ""}`}>
    📧 Email Address
  </label>
  <div className="rg-input-wrap">
    <input
      className={`rg-input ${focused.email ? "focused" : ""} ${touched.email && errors.email ? "errored" : ""}`}
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
    <div className="rg-field-err">⚠ {errors.email}</div>
  )}
</div>

{/* Password Field */}
<div className="rg-field">
  <label className={`rg-label ${focused.password ? "focused" : ""} ${touched.password && errors.password ? "errored" : ""}`}>
    🔒 Password
  </label>
  <div className="rg-input-wrap">
    <input
      className={`rg-input has-toggle ${focused.password ? "focused" : ""} ${touched.password && errors.password ? "errored" : ""}`}
      type={showPw ? "text" : "password"}
      value={form.password}
      onChange={e => change("password", e.target.value)}
      onFocus={() => setFocused(f => ({ ...f, password: true }))}
      onBlur={() => blur("password")}
      onKeyDown={e => e.key === "Enter" && submit()}
      placeholder="Min 6 characters"
      autoComplete="new-password"
    />
    <button className="rg-toggle" onClick={() => setShowPw(p => !p)} tabIndex={-1}>
      {showPw ? "🙈" : "👁"}
    </button>
  </div>
  {touched.password && errors.password && (
    <div className="rg-field-err">⚠ {errors.password}</div>
  )}
  {pw && (
    <div className="rg-strength">
      <div className="rg-strength-bars">
        {[1,2,3,4].map(i => (
          <div
            key={i}
            className="rg-strength-bar"
            style={{ background: i <= pwStrength ? STRENGTH_COLORS[pwStrength] : undefined }}
          />
        ))}
      </div>
      <span className="rg-strength-label" style={{ color: STRENGTH_COLORS[pwStrength] }}>
        {STRENGTH_LABELS[pwStrength]}
      </span>
    </div>
  )}
</div>

{/* Confirm Password Field */}
<div className="rg-field">
  <label className={`rg-label ${focused.confirm ? "focused" : ""} ${touched.confirm && errors.confirm ? "errored" : ""}`}>
    🔒 Confirm Password
  </label>
  <div className="rg-input-wrap">
    <input
      className={`rg-input ${focused.confirm ? "focused" : ""} ${touched.confirm && errors.confirm ? "errored" : ""}`}
      type="password"
      value={form.confirm}
      onChange={e => change("confirm", e.target.value)}
      onFocus={() => setFocused(f => ({ ...f, confirm: true }))}
      onBlur={() => blur("confirm")}
      onKeyDown={e => e.key === "Enter" && submit()}
      placeholder="Repeat your password"
      autoComplete="new-password"
    />
  </div>
  {touched.confirm && errors.confirm && (
    <div className="rg-field-err">⚠ {errors.confirm}</div>
  )}
</div>

          <div className="rg-reqs">
            {[
              { label: "6+ characters", met: pw.length >= 6 },
              { label: "Has number",    met: /[0-9]/.test(pw) },
              { label: "Has uppercase", met: /[A-Z]/.test(pw) },
            ].map(r => (
              <div key={r.label} className={`rg-req ${r.met ? "met" : ""}`}>
                {r.met ? "✓" : "○"} {r.label}
              </div>
            ))}
          </div>

          <button className="rg-btn" onClick={submit} disabled={loading}>
            {loading ? <span className="rg-spinner" /> : null}
            {loading ? "Creating account…" : "Create Account →"}
          </button>

          <div className="rg-switch">
            Already have an account?{" "}
            <button className="rg-switch-btn" onClick={onGoLogin}>Sign in</button>
          </div>
        </div>

        <div className="rg-footer">© 2025 · AI Resume ATS Analyzer · BSc CSIT Project</div>
      </div>
    </div>
  );
}
