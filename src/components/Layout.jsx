import React, { useState } from "react";
import Sidebar from "./Sidebar";
import { useAuth } from "../context/AuthContext";

const Layout = ({ children, stats }) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user } = useAuth();

  const toggleSidebar = () => setSidebarOpen((prev) => !prev);
  const closeSidebar = () => setSidebarOpen(false);

  return (
    <div className="admin-dashboard">
      <div
        className={`sidebar-overlay ${sidebarOpen ? "active" : ""}`}
        onClick={closeSidebar}
      ></div>

      <Sidebar stats={stats} />

      <main className="main-content">
        <header className="topbar">
          <div className="topbar-left">
            <button className="hamburger" onClick={toggleSidebar} aria-label="Toggle menu">
              <span></span><span></span><span></span>
            </button>
            <div>
              <h2>Dashboard</h2>
              <p>Welcome back, {user?.name || "Admin"}</p>
            </div>
          </div>
          {/* <div className="topbar-right">
            <div className="search-wrap">
              <input type="text" placeholder="Search..." />
              <button><i className="fas fa-search"></i></button>
            </div>
            <button className="notif-btn">
              <i className="fas fa-bell"></i>
              <span className="dot"></span>
            </button>
            <div className="avatar">{user?.name?.charAt(0) || "A"}</div>
          </div> */}
        </header>

        {children}
      </main>
    </div>
  );
};

export default Layout;