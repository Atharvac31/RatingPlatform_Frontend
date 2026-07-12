/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axiosClient from "../api/axiosClient";
import Layout from "../components/Layout";
import "./admin.css"; // We'll add store-specific styles here too

const AdminStoreCard = ({ store, onEdit, onDelete }) => {
  return (
    <div className="store-card-modern">
      <div className="store-card-content">
        <h3 className="store-name">{store.name}</h3>
        <p className="store-address">{store.address}</p>
        <div className="meta-row">
          <span className="avg-label">Avg Rating:</span>
          <span className="avg-value">
            {store.avgRating != null ? store.avgRating.toFixed(1) : "—"}
          </span>
          <span className="dot">•</span>
          <span className="count">{store.totalRatings ?? 0} ratings</span>
        </div>
        <div className="meta-row">
          <strong>Owner:</strong>{" "}
          {store.owner ? `${store.owner.name} (${store.owner.email})` : "No owner"}
        </div>
      </div>
      <div className="store-card-actions">
        <button className="btn-edit" onClick={() => onEdit(store.id)}>Edit</button>
        <button className="btn-delete" onClick={() => onDelete(store.id)}>Delete</button>
      </div>
    </div>
  );
};

const AdminStoreList = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });

  const navigate = useNavigate();

  // Fetch store list
  const fetchStores = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get(`/admin/stores`, { params: { page, search } });
      const raw = res.data?.data ?? [];
      const mapped = raw.map((s) => ({
        id: s.id,
        name: s.name,
        address: s.address,
        avgRating: s.average_rating ? parseFloat(s.average_rating) : null,
        totalRatings: s.ratings_count ?? 0,
        owner: s.owner ?? null,
      }));
      setStores(mapped);
      // If API returns total count, update stats
      if (res.data?.total) {
        setStats(prev => ({ ...prev, totalStores: res.data.total }));
      }
    } catch (err) {
      console.error(err);
      setError(err.response?.data?.message || "Failed to load stores");
    } finally {
      setLoading(false);
    }
  };

  // Fetch stats for sidebar badges (users & ratings from dashboard)
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

  useEffect(() => {
    fetchStores();
    fetchStats();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page]);

  

  const handleEdit = (storeId) => {
    navigate(`/admin/stores/${storeId}`);
  };

  const handleCreate = () => {
    navigate("/admin/stores/create");
  };

  const handleDelete = async (storeId) => {
    if (!window.confirm("Delete this store? This action cannot be undone.")) return;
    try {
      await axiosClient.delete(`/admin/stores/${storeId}`);
      alert("Store deleted");
      fetchStores();
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Delete failed");
    }
  };

  return (
    <Layout stats={stats}>
      <div className="page-header">
        <h2>Manage Stores</h2>
        <div className="page-actions">
          {/* <form onSubmit={handleSearch} className="search-form">
            <div className="search-wrap">
              <input
                type="search"
                placeholder="Search by name or address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
              <button type="submit"><i className="fas fa-search"></i></button>
            </div>
          </form> */}
          <button className="btn primary-btn" onClick={handleCreate}>
            + Create Store
          </button>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading stores...</div>
      ) : stores.length === 0 ? (
        <div className="empty-state">No stores found.</div>
      ) : (
        <div className="stores-grid">
          {stores.map((store) => (
            <AdminStoreCard
              key={store.id}
              store={store}
              onEdit={handleEdit}
              onDelete={handleDelete}
            />
          ))}
        </div>
      )}

      <div className="pagination-modern">
        <button
          className="page-btn"
          onClick={() => setPage((p) => Math.max(1, p - 1))}
          disabled={page === 1}
        >
          Prev
        </button>
        <span className="page-indicator">Page {page}</span>
        <button className="page-btn" onClick={() => setPage((p) => p + 1)}>
          Next
        </button>
      </div>
    </Layout>
  );
};

export default AdminStoreList;