import React from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Sidebar = ({ stats }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const { logout } = useAuth();

  const isActive = (path) => location.pathname === path;

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="brand-icon"><i className="fas fa-cube"></i></div>
        <h1>Dash<span>Board</span></h1>
      </div>

      <nav className="sidebar-nav">
        <span className="nav-label">Main</span>
        <Link to="/admin/dashboard" className={isActive("/admin/dashboard") ? "active" : ""}>
          <i className="fas fa-th-large"></i> Dashboard
        </Link>
        <Link to="/admin/users" className={isActive("/admin/users") ? "active" : ""}>
          <i className="fas fa-users"></i> Users <span className="badge">{stats?.totalUsers || 0}</span>
        </Link>
        <Link to="/stores" className={isActive("/stores") ? "active" : ""}>
          <i className="fas fa-store"></i> Stores <span className="badge">{stats?.totalStores || 0}</span>
        </Link>

        <Link to="/admin/stores/create" className={isActive("/admin/stores/create") ? "active" : ""}>
          <i className="fas fa-plus-circle"></i> Create Store
        </Link>
      </nav>

      <div className="sidebar-footer">
        <button
          className="sidebar-logout"
          onClick={() => { logout(); navigate("/login"); }}
        >
          <i className="fas fa-sign-out-alt"></i> Logout
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;