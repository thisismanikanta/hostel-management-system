import React from 'react';

function Sidebar({ currentTab, setCurrentTab }) {
  const menuItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'students', label: 'Students' },
    { id: 'hostels', label: 'Hostels' },
    { id: 'rooms', label: 'Rooms' },
    { id: 'allocations', label: 'Room Allocations' },
    { id: 'complaints', label: 'Complaints' },
  ];

  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <h2 className="brand-title">Hostel Admin</h2>
        <span className="brand-subtitle">Management System</span>
      </div>

      <nav className="sidebar-nav">
        {menuItems.map((item) => (
          <button
            key={item.id}
            type="button"
            className={`nav-item ${currentTab === item.id ? 'active' : ''}`}
            onClick={() => setCurrentTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="sidebar-footer">
        <div className="system-status">
          <span className="status-indicator"></span>
          <span className="status-text">Server: Online (Port 8080)</span>
        </div>
      </div>
    </aside>
  );
}

export default Sidebar;
