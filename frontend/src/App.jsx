import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import Header from './components/Header';
import Dashboard from './pages/Dashboard';
import Students from './pages/Students';
import Hostels from './pages/Hostels';
import Rooms from './pages/Rooms';
import Allocations from './pages/Allocations';
import Complaints from './pages/Complaints';
import './App.css';

function App() {
  const [currentTab, setCurrentTab] = useState('dashboard');

  const renderContent = () => {
    switch (currentTab) {
      case 'dashboard':
        return <Dashboard setCurrentTab={setCurrentTab} />;
      case 'students':
        return <Students />;
      case 'hostels':
        return <Hostels />;
      case 'rooms':
        return <Rooms />;
      case 'allocations':
        return <Allocations />;
      case 'complaints':
        return <Complaints />;
      default:
        return <Dashboard setCurrentTab={setCurrentTab} />;
    }
  };

  return (
    <div className="app-layout">
      <Sidebar currentTab={currentTab} setCurrentTab={setCurrentTab} />
      <div className="main-wrapper">
        <Header currentTab={currentTab} />
        <main className="content-area">
          {renderContent()}
        </main>
      </div>
    </div>
  );
}

export default App;
