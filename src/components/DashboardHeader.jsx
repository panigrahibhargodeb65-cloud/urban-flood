import React from 'react';
import { Bell, User, LogOut } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function DashboardHeader({ activeTab, setActiveTab, onLogout }) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard' },
    { id: 'flood-map', label: 'Flood Map' },
    { id: 'hotspots', label: 'Hotspots' },
    { id: 'incidents', label: 'Incidents' },
    { id: 'assets', label: 'Assets' },
  ];

  return (
    <header className="gov-header">
      <div className="header-left">
        <div className="brand-logo-container">
          <img src={logoImg} alt="Urban Flood Intelligence System Logo" className="brand-logo-img" />
        </div>
        <div className="brand-title-wrap">
          <h1 className="gov-title">Urban Flood Intelligence System</h1>
          <p className="gov-subtitle">Smart Urban Flood Monitoring &amp; Response</p>
        </div>
      </div>

      <nav className="header-nav">
        {navItems.map((item) => (
          <button
            key={item.id}
            className={`nav-item-btn ${activeTab === item.id ? 'active' : ''}`}
            onClick={() => setActiveTab(item.id)}
          >
            {item.label}
          </button>
        ))}
      </nav>

      <div className="header-right">
        <div className="system-online-pill">
          <span className="online-dot"></span>
          <span className="online-text">System Online</span>
        </div>

        <div className="update-timestamp">
          <span className="update-label">Last Updated:</span>
          <span className="update-time">10:42 AM</span>
        </div>

        <button className="icon-btn notification-btn" title="Notifications">
          <Bell size={17} />
          <span className="bell-badge">3</span>
        </button>

        <div className="user-profile-badge">
          <div className="avatar-box">
            <User size={16} />
          </div>
          <div className="user-info">
            <span className="user-name">Cmdr. V. Sharma</span>
            <span className="user-role">Municipal Authority</span>
          </div>
        </div>

        <button className="logout-btn" onClick={onLogout} title="Return to Login">
          <LogOut size={16} />
          <span>Exit</span>
        </button>
      </div>
    </header>
  );
}
