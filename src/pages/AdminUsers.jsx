import React, { useEffect, useState } from "react";
import axiosClient from "../api/axiosClient";
import { Link } from "react-router-dom";
import Layout from "../components/Layout";
import "./admin.css";

const AdminUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await axiosClient.get("/admin/users");
      const raw = res.data?.data ?? res.data ?? [];
      setUsers(raw);
    } catch (err) {
      console.error(err);
      setError("Failed to load users");
    } finally {
      setLoading(false);
    }
  };

  const filtered = users.filter((u) => {
    if (!search) return true;
    const s = search.toLowerCase();
    return (u.name || "").toLowerCase().includes(s) || (u.email || "").toLowerCase().includes(s);
  });

  // We'll fetch stats from dashboard endpoint or compute from users
  const stats = {
    totalUsers: users.length,
    totalStores: 0, // could be fetched separately
    totalRatings: 0,
  };

  return (
    <Layout stats={stats}>
      <div className="page-header">
        <h2>Users</h2>
        <div className="page-actions">
          <div className="search-wrap" style={{ margin: 10, width: "27%" }}  >
            <input
              type="text"
              placeholder="Search users..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            <button><i className="fas fa-search"></i></button>
          </div>
        </div>
      </div>

      {error && <div className="admin-error">{error}</div>}

      {loading ? (
        <div className="loading-spinner">Loading users...</div>
      ) : (
        <div className="table-card" style={{ padding: 0, overflow: "hidden" }}>
          <table className="admin-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {filtered.length === 0 ? (
                <tr><td colSpan="5" style={{ textAlign: "center", padding: 40 }}>No users found</td></tr>
              ) : (
                filtered.map((u) => (
                  <tr key={u.id}>
                    <td>{u.id}</td>
                    <td>
                      <div className="user-cell">
                        <span className="avatar-sm">{u.name?.charAt(0) || "U"}</span>
                        <Link to={`/admin/users/${u.id}`} className="user-link">{u.name}</Link>
                      </div>
                    </td>
                    <td>{u.email}</td>
                    <td>
                      <span className={`role-badge ${(u.role || "user").toLowerCase()}`}>
                        {u.role || "User"}
                      </span>
                    </td>
                    <td>
                      <Link to={`/admin/users/${u.id}`} className="action-link">View</Link>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </Layout>
  );
};

export default AdminUsers;