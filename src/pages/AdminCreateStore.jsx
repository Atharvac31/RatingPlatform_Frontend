import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../components/Layout";
import "./admincreate.css";

const AdminCreateStore = () => {
  const [form, setForm] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [loading, setLoading] = useState(false);
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const navigate = useNavigate();

  // Fetch stats for sidebar badges
  useEffect(() => {
    const fetchStats = async () => {
      try {
        const res = await axiosClient.get("/admin/dashboard");
        const d = res.data || {};
        setStats({
          totalUsers: d.totalUsers ?? d.total_users ?? d.users ?? 0,
          totalStores: d.totalStores ?? d.total_stores ?? d.stores ?? 0,
          totalRatings: d.totalRatings ?? d.total_ratings ?? d.ratings ?? 0,
        });
      } catch (err) {
        console.error("Failed to fetch stats for sidebar", err);
      }
    };
    fetchStats();
  }, []);

  const handleChange = (e) => setForm((p) => ({ ...p, [e.target.name]: e.target.value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axiosClient.post("/admin/stores", {
        name: form.name,
        email: form.email,
        address: form.address,
        ownerId: form.ownerId || undefined,
      });
      alert("Store created successfully!");
      navigate("/admin/stores");
    } catch (err) {
      alert(err.response?.data?.message || "Create store failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Layout stats={stats}>
      <div className="page-header">
        <h2>Create Store</h2>

      </div>

      <div className="form-card">
        <form className="admin-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="name">Store Name</label>
            <input
              id="name"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="admin-input"
              required
              placeholder="Enter store name"
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email</label>
            <input
              id="email"
              name="email"
              type="email"
              value={form.email}
              onChange={handleChange}
              className="admin-input"
              placeholder="store@example.com"
            />
          </div>

          <div className="form-group">
            <label htmlFor="address">Address</label>
            <textarea
              id="address"
              name="address"
              value={form.address}
              onChange={handleChange}
              className="admin-input"
              rows="3"
              placeholder="Store address"
            />
          </div>

          <div className="form-group">
            <label htmlFor="ownerId">Owner (user id)</label>
            <input
              id="ownerId"
              name="ownerId"
              value={form.ownerId}
              onChange={handleChange}
              className="admin-input"
              placeholder="Enter user ID of the owner"
            />
          </div>

          <button className="btn primary-btn" type="submit" disabled={loading}>
            {loading ? "Creating..." : "Create Store"}
          </button>
        </form>
      </div>
    </Layout>
  );
};

export default AdminCreateStore;