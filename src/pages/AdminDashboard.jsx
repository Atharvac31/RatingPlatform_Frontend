import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../components/Layout";
import "./admin.css";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      setLoading(true);
      setError("");
      try {
        const res = await axiosClient.get("/admin/dashboard");
        const d = res.data || {};
        setStats({
          totalUsers: d.totalUsers ?? d.total_users ?? d.total_users_count ?? d.users ?? 0,
          totalStores: d.totalStores ?? d.total_stores ?? d.stores ?? 0,
          totalRatings: d.totalRatings ?? d.total_ratings ?? d.ratings ?? 0,
        });
      } catch (err) {
        console.error(err);
        setError("Failed to load dashboard stats");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <Layout stats={stats}>
      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading...</div>
      ) : (
        <>
          {/* Stats Grid */}
          <section className="stats-grid">
            <div className="stat-card">
              <div className="stat-icon blue"><i className="fas fa-users"></i></div>
              <div className="stat-number">{stats.totalUsers}</div>
              <div className="stat-label">Total Users</div>
              <Link to="/admin/users" className="stat-link">
                View users <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon green"><i className="fas fa-store"></i></div>
              <div className="stat-number">{stats.totalStores}</div>
              <div className="stat-label">Total Stores</div>
              <Link to="/stores" className="stat-link">
                View stores <i className="fas fa-arrow-right"></i>
              </Link>
            </div>
            <div className="stat-card">
              <div className="stat-icon purple"><i className="fas fa-star"></i></div>
              <div className="stat-number">{stats.totalRatings}</div>
              <div className="stat-label">Total Ratings</div>
              <Link to="/stores" className="stat-link">
                View ratings <i className="fas fa-arrow-right"></i>
              </Link>
            </div>

          </section>




        </>
      )}
    </Layout>
  );
};

export default AdminDashboard;