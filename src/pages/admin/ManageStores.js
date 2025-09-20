// src/pages/admin/ManageStores.js
import React, { useEffect, useState } from "react";
import API from "../../api/axios";

export default function ManageStores() {
  const [stores, setStores] = useState([]);
  const [owners, setOwners] = useState([]);
  const [storeForm, setStoreForm] = useState({
    name: "",
    email: "",
    address: "",
    ownerId: "",
  });
  const [filters, setFilters] = useState({ name: "", email: "", address: "", ownerId: "" });
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // Fetch owners for dropdown
  const fetchOwners = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/users", {
        headers: { Authorization: `Bearer ${token}` },
        params: { role: "OWNER" },
      });
      if (res.data?.data) setOwners(res.data.data);
    } catch (err) {
      console.error("Error fetching owners:", err);
    }
  };

  // Fetch stores
  const fetchStores = async (appliedFilters = {}) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/admin/stores", {
        headers: { Authorization: `Bearer ${token}` },
        params: appliedFilters,
      });
      if (res.data?.data) setStores(res.data.data);
      else setStores([]);
    } catch (err) {
      console.error("Error fetching stores:", err);
      setStores([]);
    }
  };

  useEffect(() => {
    fetchOwners();
    fetchStores();
  }, []);

  const handleChange = (e) =>
    setStoreForm({ ...storeForm, [e.target.name]: e.target.value });

  const addStore = async (e) => {
    e.preventDefault();
    if (!storeForm.name || !storeForm.ownerId) {
      alert("Store Name and Owner are required!");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await API.post("/admin/stores", storeForm, {
        headers: { Authorization: `Bearer ${token}` },
      });
      alert("Store added successfully!");
      setStoreForm({ name: "", email: "", address: "", ownerId: "" });
      fetchStores();
    } catch (err) {
      alert("Error adding store: " + (err.response?.data?.message || err.message));
    }
  };

  const applyFilters = () => {
    const applied = {};
    Object.keys(filters).forEach((key) => {
      if (filters[key].trim() !== "") applied[key] = filters[key];
    });
    fetchStores(applied);
  };

  const clearFilters = () => {
    setFilters({ name: "", email: "", address: "", ownerId: "" });
    fetchStores();
  };

  // Sorting logic
  const sortedStores = React.useMemo(() => {
    let sortableStores = [...stores];
    if (sortConfig.key !== null) {
      sortableStores.sort((a, b) => {
        let aVal = a[sortConfig.key] || "";
        let bVal = b[sortConfig.key] || "";

        // Special case for Owner name
        if (sortConfig.key === "owner") {
          const ownerA = owners.find((o) => (o.id ?? o._id) === a.ownerId);
          const ownerB = owners.find((o) => (o.id ?? o._id) === b.ownerId);
          aVal = ownerA?.name || "";
          bVal = ownerB?.name || "";
        }

        aVal = aVal.toString().toLowerCase();
        bVal = bVal.toString().toLowerCase();

        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortableStores;
  }, [stores, sortConfig, owners]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="dashboard-container">
      <h2>Manage Stores</h2>

      {/* Add Store Form */}
      <div className="form-section" style={{ maxWidth: "700px", margin: "auto" }}>
        <h3>Add Store</h3>
        <form onSubmit={addStore}>
          <input
            name="name"
            placeholder="Store Name"
            value={storeForm.name}
            onChange={handleChange}
            required
          />
          <input
            name="email"
            type="email"
            placeholder="Email"
            value={storeForm.email}
            onChange={handleChange}
          />
          <input
            name="address"
            placeholder="Address"
            value={storeForm.address}
            onChange={handleChange}
          />
          <select
            name="ownerId"
            value={storeForm.ownerId}
            onChange={handleChange}
            required
          >
            <option value="">Select Owner</option>
            {owners.map((o) => (
              <option key={o.id ?? o._id} value={o.id ?? o._id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>
          <button type="submit">Add Store</button>
        </form>
      </div>

      {/* Filters Section */}
      <div className="filters" style={{ marginTop: 40, maxWidth: "700px", margin: "auto" }}>
        <h3 style={{ marginBottom: 12 }}>Search Stores</h3>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "12px", alignItems: "center" }}>
          <input
            placeholder="Filter by Store Name"
            value={filters.name}
            onChange={(e) => setFilters({ ...filters, name: e.target.value })}
          />
          <input
            placeholder="Filter by Email"
            value={filters.email}
            onChange={(e) => setFilters({ ...filters, email: e.target.value })}
          />
          <input
            placeholder="Filter by Address"
            value={filters.address}
            onChange={(e) => setFilters({ ...filters, address: e.target.value })}
          />
          <select
            value={filters.ownerId}
            onChange={(e) => setFilters({ ...filters, ownerId: e.target.value })}
          >
            <option value="">All Owners</option>
            {owners.map((o) => (
              <option key={o.id || o._id} value={o.id || o._id}>
                {o.name} ({o.email})
              </option>
            ))}
          </select>

          <button type="button" onClick={applyFilters}>Apply Filters</button>
          <button type="button" onClick={clearFilters}>Clear Filters</button>
        </div>
      </div>

      {/* Store List Table */}
      <div style={{ overflowX: "auto", marginTop: 30 }}>
        <table className="data-table" style={{ width: "100%", maxWidth: "900px", margin: "auto" }}>
          <thead>
            <tr>
              <th>Sr. No</th>
              <th
                className={`sortable ${sortConfig.key === "name" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("name")}
              >
                Name
              </th>
              <th
                className={`sortable ${sortConfig.key === "email" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("email")}
              >
                Email
              </th>
              <th
                className={`sortable ${sortConfig.key === "address" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("address")}
              >
                Address
              </th>
              <th
                className={`sortable ${sortConfig.key === "owner" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("owner")}
              >
                Owner
              </th>
              <th>Rating</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores.length > 0 ? (
              sortedStores.map((s, idx) => {
                const owner = owners.find((o) => (o.id ?? o._id) === s.ownerId);
                return (
                  <tr key={s._id ?? s.id}>
                    <td>{idx + 1}</td>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{owner ? owner.name : "N/A"}</td>
                    <td>{s.overallRating ? s.overallRating.toFixed(2) + "⭐" : "N/A"}</td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>No stores available</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* CSS for arrows */}
      <style>{`
        th.sortable {
          cursor: pointer;
          position: relative;
          padding-right: 20px;
        }
        th.sortable::after {
          content: '';
          position: absolute;
          right: 8px;
          top: 50%;
          transform: translateY(-50%);
          border: 5px solid transparent;
        }
        th.sortable.asc::after {
          border-bottom-color: #333;
        }
        th.sortable.desc::after {
          border-top-color: #333;
        }
      `}</style>
    </div>
  );
}
