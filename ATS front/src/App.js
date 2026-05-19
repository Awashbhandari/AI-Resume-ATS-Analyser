import { useState } from "react";
import Home           from "./auth/Home";
import Login          from "./auth/Login";
import Register       from "./auth/Register";
import AdminDashboard from "./auth/AdminDashboard";

// Decode JWT to get role without extra library
function getRole(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const roles = payload.roles || payload.role || [];
    if (Array.isArray(roles)) return roles[0] || "USER";
    return roles;
  } catch { return "USER"; }
}

function App() {
  const [page,     setPage]     = useState("home");
  const [loggedIn, setLoggedIn] = useState(
    !!localStorage.getItem("token")
  );
  const [isAdmin,  setIsAdmin]  = useState(() => {
    const t = localStorage.getItem("token");
    return t ? getRole(t) === "ROLE_ADMIN" || getRole(t) === "ADMIN" : false;
  });

  const handleLogin = () => {
    const token = localStorage.getItem("token");
    const role  = token ? getRole(token) : "USER";
    const admin = role === "ROLE_ADMIN" || role === "ADMIN";
    setLoggedIn(true);
    setIsAdmin(admin);
    setPage(admin ? "admin" : "home");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setLoggedIn(false);
    setIsAdmin(false);
    setPage("home");
  };

  return (
    <div>
      {page === "home" && (
        <Home
          loggedIn={loggedIn}
          isAdmin={isAdmin}
          onSignInClick={() => { if (!loggedIn) setPage("login"); }}
          onLogout={handleLogout}
          onAdminClick={() => setPage("admin")}
        />
      )}
      {page === "login" && (
        <Login
          onLogin={handleLogin}
          onGoRegister={() => setPage("register")}
        />
      )}
      {page === "register" && (
        <Register
          onSuccess={() => setPage("login")}
          onGoLogin={() => setPage("login")}
        />
      )}
      {page === "admin" && (
        <AdminDashboard
          onLogout={handleLogout}
          onBack={() => setPage("home")}
        />
      )}
    </div>
  );
}

export default App;