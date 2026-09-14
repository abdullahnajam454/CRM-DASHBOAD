import { useState } from "react";
import { NavLink, Outlet, useLocation, useNavigate } from "react-router-dom";
import { apiRequest } from "../../lib/api";

const navigation = [
  { label: "Overview", path: "/dashboard", icon: "◒" },
  { label: "Leads", path: "/leads", icon: "↗" },
  { label: "Members", path: "/members", icon: "♧" },
];

const AppShell = () => {
  const [mobileOpen, setMobileOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const current = navigation.find((item) => location.pathname.startsWith(item.path));

  const logout = async () => {
    try {
      await apiRequest("/auth/logout", { method: "POST" });
    } catch {
      // Clear local state and leave the workspace even if the API is unavailable.
    }
    sessionStorage.removeItem("crm-authenticated");
    navigate("/login");
  };

  return (
    <div className="app-shell">
      <aside className={`sidebar ${mobileOpen ? "sidebar-open" : ""}`}>
        <div className="brand-lockup">
          <div className="brand-mark">N</div>
          <div>
            <strong>northstar</strong>
            <span>revenue workspace</span>
          </div>
        </div>
        <div className="workspace-switcher">
          <div className="workspace-avatar">AC</div>
          <div><strong>Acme Collective</strong><span>Growth team</span></div>
          <span className="chevron">⌄</span>
        </div>
        <p className="nav-caption">Workspace</p>
        <nav className="main-nav">
          {navigation.map((item) => (
            <NavLink key={item.path} to={item.path} onClick={() => setMobileOpen(false)} className={({ isActive }) => `nav-item ${isActive ? "active" : ""}`}>
              <span className="nav-icon">{item.icon}</span>{item.label}
            </NavLink>
          ))}
        </nav>
        <div className="sidebar-bottom">
          <div className="sidebar-note"><span>✦</span><div><strong>Keep momentum</strong><small>3 follow-ups due today</small></div></div>
          <button className="profile-button" onClick={logout} title="Log out">
            <span className="profile-avatar">JD</span><span><strong>Jordan Davis</strong><small>Owner account</small></span><span className="logout-label">Log out</span><span className="logout-arrow">↪</span>
          </button>
        </div>
      </aside>
      {mobileOpen && <button className="mobile-scrim" onClick={() => setMobileOpen(false)} aria-label="Close menu" />}
      <main className="main-area">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileOpen(true)} aria-label="Open menu">☰</button>
          <div><p className="eyebrow">Workspace / {current?.label || "Overview"}</p><h1>{current?.label || "Overview"}</h1></div>
          <div className="topbar-actions"><button className="icon-button" title="Search">⌕</button><button className="icon-button notification" title="Notifications">♢<i /></button><div className="topbar-date">Monday, Sep 14 <span>·</span> 2026</div></div>
        </header>
        <div className="page-content"><Outlet /></div>
      </main>
    </div>
  );
};

export default AppShell;