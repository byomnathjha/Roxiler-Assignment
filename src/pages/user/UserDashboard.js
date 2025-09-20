// src/pages/user/UserDashboard.js
import React, { useEffect, useState, useMemo } from "react";
import API from "../../api/axios";

export default function UserDashboard() {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState({ name: "", address: "" });
  const [ratings, setRatings] = useState({}); 
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  
  const fetchStores = async (filters = {}) => {
    try {
      const token = localStorage.getItem("token");
      const res = await API.get("/user/stores", {
        headers: { Authorization: `Bearer ${token}` },
        params: filters,
      });

      if (res.data?.data) {
        setStores(res.data.data);

        
        const r = {};
        res.data.data.forEach((store) => {
          const storeId = store._id || store.id;
          if (store.userRating) r[storeId] = store.userRating;
        });
        setRatings(r);
      }
    } catch (err) {
      console.error("Error fetching stores:", err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  // Rating input change
  const handleRatingChange = (storeId, value) => {
    const numericValue = parseInt(value, 10);
    if ((numericValue >= 1 && numericValue <= 5) || value === "") {
      setRatings((prev) => ({ ...prev, [storeId]: value === "" ? "" : numericValue }));
    }
  };

  // Submit rating
  const submitRating = async (storeId) => {
    if (!ratings[storeId] || ratings[storeId] < 1 || ratings[storeId] > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await API.post(
        `/user/stores/${storeId}/rating`,
        { rating: ratings[storeId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating submitted successfully!");
      fetchStores(search);
    } catch (err) {
      alert("Error submitting rating: " + (err.response?.data?.message || err.message));
    }
  };

  // Update rating
  const updateRating = async (storeId) => {
    if (!ratings[storeId] || ratings[storeId] < 1 || ratings[storeId] > 5) {
      alert("Please enter a rating between 1 and 5.");
      return;
    }
    try {
      const token = localStorage.getItem("token");
      await API.put(
        `/user/stores/${storeId}/rating`,
        { rating: ratings[storeId] },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Rating updated successfully!");
      fetchStores(search);
    } catch (err) {
      alert("Error updating rating: " + (err.response?.data?.message || err.message));
    }
  };

  // Search handlers
  const applySearch = () => {
    const filters = {};
    if (search.name) filters.name = search.name;
    if (search.address) filters.address = search.address;
    fetchStores(filters);
  };

  const clearSearch = () => {
    setSearch({ name: "", address: "" });
    fetchStores();
  };

  // Sorting logic
  const sortedStores = useMemo(() => {
    let sortable = [...stores];
    if (sortConfig.key !== null) {
      sortable.sort((a, b) => {
        let aVal, bVal;
        if (sortConfig.key === "overallRating") {
          aVal = a.overallRating ?? 0;
          bVal = b.overallRating ?? 0;
        } else {
          aVal = a[sortConfig.key] ? a[sortConfig.key].toString().toLowerCase() : "";
          bVal = b[sortConfig.key] ? b[sortConfig.key].toString().toLowerCase() : "";
        }
        if (aVal < bVal) return sortConfig.direction === "asc" ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }
    return sortable;
  }, [stores, sortConfig]);

  const requestSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") direction = "desc";
    setSortConfig({ key, direction });
  };

  return (
    <div className="dashboard-container">
      <h2>User Dashboard</h2>

      {/* Search / Filter */}
      <div
        className="filters"
        style={{
          display: "flex",
          gap: "10px",
          marginBottom: 20,
          alignItems: "center"
        }}
      >
        <input
          placeholder="Search by Store Name"
          value={search.name}
          onChange={(e) => setSearch({ ...search, name: e.target.value })}
          style={{ padding: "8px 12px", fontSize: "14px" }}
        />
        <input
          placeholder="Search by Address"
          value={search.address}
          onChange={(e) => setSearch({ ...search, address: e.target.value })}
          style={{ padding: "8px 12px", fontSize: "14px" }}
        />
        <button
          onClick={applySearch}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            border: "none"
          }}
        >
          Search
        </button>
        <button
          onClick={clearSearch}
          style={{
            padding: "8px 12px",
            fontSize: "14px",
            borderRadius: "6px",
            cursor: "pointer",
            background: "linear-gradient(135deg, #667eea, #764ba2)",
            color: "white",
            border: "none"
          }}
        >
          Clear
        </button>
      </div>

      {/* Stores Table */}
      <div style={{ overflowX: "auto" }}>
        <table className="data-table">
          <thead>
            <tr>
              <th>Sr. No</th>
              <th
                className={`sortable ${sortConfig.key === "name" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("name")}
              >
                Store Name
              </th>
              <th
                className={`sortable ${sortConfig.key === "address" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("address")}
              >
                Address
              </th>
              <th
                className={`sortable ${sortConfig.key === "overallRating" ? sortConfig.direction : ""}`}
                onClick={() => requestSort("overallRating")}
              >
                Overall Rating
              </th>
              <th>Your Rating</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {sortedStores.length > 0 ? (
              sortedStores.map((store, idx) => {
                const storeId = store._id || store.id;
                return (
                  <tr key={storeId}>
                    <td>{idx + 1}</td>
                    <td>{store.name}</td>
                    <td>{store.address}</td>
                    <td>
                      {store.overallRating && store.overallRating > 0
                        ? store.overallRating.toFixed(2)
                        : "N/A"}
                    </td>
                    <td>
                      <input
                        type="number"
                        min="1"
                        max="5"
                        value={ratings[storeId] ?? ""}
                        onChange={(e) => handleRatingChange(storeId, e.target.value)}
                        style={{ width: "60px" }}
                      />
                    </td>
                    <td>
                      {!store.userRating ? (
                        <button onClick={() => submitRating(storeId)}>Submit</button>
                      ) : (
                        <button onClick={() => updateRating(storeId)}>Modify</button>
                      )}
                    </td>
                  </tr>
                );
              })
            ) : (
              <tr>
                <td colSpan="6" style={{ textAlign: "center" }}>
                  No stores available
                </td>
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
