import React from 'react';

function Header({ currentTab }) {
  const titles = {
    dashboard: 'Dashboard Overview',
    students: 'Student Directory',
    hostels: 'Hostel Buildings',
    rooms: 'Room Management',
    allocations: 'Room Allocation Records',
    complaints: 'Grievance & Complaints',
  };

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'short',
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <header className="top-header">
      <div className="header-left">
        <h1 className="page-heading">{titles[currentTab] || 'Hostel Management'}</h1>
      </div>
      <div className="header-right">
        <span className="header-badge">Academic Year 2026-2027</span>
        <span className="header-date">{currentDate}</span>
      </div>
    </header>
  );
}

export default Header;
