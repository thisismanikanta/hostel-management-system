import React, { useEffect, useState } from 'react';
import { dashboardApi } from '../services/api';

function Dashboard({ setCurrentTab }) {
  const [stats, setStats] = useState({
    totalStudents: 0,
    totalHostels: 0,
    totalRooms: 0,
    occupiedRooms: 0,
    availableRooms: 0,
    pendingComplaints: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchStats = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await dashboardApi.getStats();
      setStats(data);
    } catch (err) {
      setError('Could not connect to backend server. Make sure Spring Boot is running on port 8080.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const occupancyRate = stats.totalRooms > 0
    ? Math.round((stats.occupiedRooms / stats.totalRooms) * 100)
    : 0;

  return (
    <div className="page-container">
      <div className="page-header-row">
        <div>
          <h2 className="section-title">Dashboard Statistics</h2>
          <p className="section-description">Key metrics and statistics for campus hostel facilities</p>
        </div>
        <button type="button" className="btn btn-secondary" onClick={fetchStats}>
          Refresh Stats
        </button>
      </div>

      {error && <div className="alert alert-error">{error}</div>}

      {loading ? (
        <div className="loading-state">Loading dashboard statistics...</div>
      ) : (
        <>
          <div className="stats-grid">
            <div className="stat-card">
              <span className="stat-label">Total Students</span>
              <span className="stat-value">{stats.totalStudents}</span>
              <span className="stat-footnote">Registered in database</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Hostels</span>
              <span className="stat-value">{stats.totalHostels}</span>
              <span className="stat-footnote">Hostel buildings</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Total Rooms</span>
              <span className="stat-value">{stats.totalRooms}</span>
              <span className="stat-footnote">Across all blocks</span>
            </div>

            <div className="stat-card stat-highlight">
              <span className="stat-label">Occupied Rooms</span>
              <span className="stat-value">{stats.occupiedRooms}</span>
              <span className="stat-footnote">{occupancyRate}% occupancy rate</span>
            </div>

            <div className="stat-card">
              <span className="stat-label">Available Rooms</span>
              <span className="stat-value">{stats.availableRooms}</span>
              <span className="stat-footnote">Ready for allocation</span>
            </div>

            <div className="stat-card stat-alert">
              <span className="stat-label">Pending Complaints</span>
              <span className="stat-value">{stats.pendingComplaints}</span>
              <span className="stat-footnote">Awaiting resolution</span>
            </div>
          </div>

          <div className="dashboard-sections-grid">
            <div className="panel">
              <h3 className="panel-title">Occupancy Summary</h3>
              <div className="occupancy-container">
                <div className="occupancy-info-row">
                  <span>Room Allocation Status</span>
                  <span>{occupancyRate}% Full</span>
                </div>
                <div className="progress-bar-bg">
                  <div
                    className="progress-bar-fill"
                    style={{ width: `${Math.min(100, occupancyRate)}%` }}
                  ></div>
                </div>
                <div className="stats-breakdown">
                  <div className="breakdown-item">
                    <span className="breakdown-dot occupied"></span>
                    <span>Occupied: <strong>{stats.occupiedRooms}</strong></span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-dot available"></span>
                    <span>Available: <strong>{stats.availableRooms}</strong></span>
                  </div>
                  <div className="breakdown-item">
                    <span className="breakdown-dot total"></span>
                    <span>Total: <strong>{stats.totalRooms}</strong></span>
                  </div>
                </div>
              </div>
            </div>

            <div className="panel">
              <h3 className="panel-title">Quick Actions</h3>
              <p className="panel-subtitle">Access core management modules directly</p>
              <div className="quick-actions-list">
                <button
                  type="button"
                  className="btn btn-outline full-width"
                  onClick={() => setCurrentTab('students')}
                >
                  Manage Students
                </button>
                <button
                  type="button"
                  className="btn btn-outline full-width"
                  onClick={() => setCurrentTab('allocations')}
                >
                  Allocate Room to Student
                </button>
                <button
                  type="button"
                  className="btn btn-outline full-width"
                  onClick={() => setCurrentTab('rooms')}
                >
                  View and Add Rooms
                </button>
                <button
                  type="button"
                  className="btn btn-outline full-width"
                  onClick={() => setCurrentTab('complaints')}
                >
                  View Pending Complaints
                </button>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}

export default Dashboard;
