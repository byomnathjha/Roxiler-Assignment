// src/pages/OwnerDashboard.jsx
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../context/AuthContext";
import axios from "axios";

export default function OwnerDashboard() {
  const { user } = useContext(AuthContext);

  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");


  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc", storeId: null });

  // Fetch store ratings
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          "http://localhost:5000/api/owner/stores/ratings",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setStores(res.data.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load store data");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Handle sorting per store
  const requestSort = (storeId, key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc" && sortConfig.storeId === storeId) {
      direction = "desc";
    }
    setSortConfig({ key, direction, storeId });
  };

  const getSortedRatings = (store) => {
    if (sortConfig.storeId !== store.storeId || !sortConfig.key) return store.ratings;
    return [...store.ratings].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) return sortConfig.direction === "asc" ? -1 : 1;
      if (a[sortConfig.key] > b[sortConfig.key]) return sortConfig.direction === "asc" ? 1 : -1;
      return 0;
    });
  };

  const getSortArrow = (storeId, key) => {
    if (sortConfig.key === key && sortConfig.storeId === storeId) {
      return sortConfig.direction === "asc" ? " ↑" : " ↓";
    }
    return "";
  };

  return (
    <div className="p-6 min-h-screen bg-gradient-to-br from-purple-200 to-indigo-300">
      <div className="dashboard-container">
        
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-3xl font-bold text-indigo-700">Owner Dashboard</h2>
        </div>

        {}
        <div className="mb-8">
          <p className="text-lg">
            Welcome, <b>{user?.name}</b> (Owner)
          </p>
        </div>

        {/* Stores as Cards */}
        {loading ? (
          <p>Loading...</p>
        ) : error ? (
          <p className="text-red-600">{error}</p>
        ) : stores.length === 0 ? (
          <p>No stores found.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {stores.map((store) => (
              <div
                key={store.storeId}
                className="bg-white rounded-2xl shadow-lg p-6 hover:shadow-2xl transition"
              >
                <div className="flex justify-between items-center mb-4">
                  <h3 className="text-xl font-bold text-indigo-600">{store.storeName}</h3>
                  <span className="text-lg font-semibold bg-gradient-to-r from-purple-400 to-indigo-500 text-white px-3 py-1 rounded-full">
                    {store.averageRating.toFixed(2)}⭐
                  </span>
                </div>

                {/* User Ratings */}
                {store.ratings.length === 0 ? (
                  <p className="text-gray-500">No ratings yet.</p>
                ) : (
                  <table className="data-table w-full mt-2">
                    <thead>
                      <tr>
                        <th onClick={() => requestSort(store.storeId, "userName")} style={{ cursor: "pointer" }}>
                          User Name{getSortArrow(store.storeId, "userName")}
                        </th>
                        <th onClick={() => requestSort(store.storeId, "userEmail")} style={{ cursor: "pointer" }}>
                          Email{getSortArrow(store.storeId, "userEmail")}
                        </th>
                        <th onClick={() => requestSort(store.storeId, "rating")} style={{ cursor: "pointer" }}>
                          Rating{getSortArrow(store.storeId, "rating")}
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedRatings(store).map((r, i) => (
                        <tr key={i}>
                          <td>{r.userName}</td>
                          <td>{r.userEmail}</td>
                          <td>{r.rating}⭐</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
