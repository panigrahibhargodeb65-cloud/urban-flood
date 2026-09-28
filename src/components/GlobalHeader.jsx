import React from 'react';
import { useApp } from '../context/AppContext';
import { LogOut, Lock, Bell, Check, Activity } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function GlobalHeader({ activeNav, setActiveNav }) {
  const { auth, logout, setActiveModal, notifications = [], markNotificationAsRead } = useApp();
  const currentRole = auth?.role || 'government';
  const user = auth?.user || {};
  const [showNotifDropdown, setShowNotifDropdown] = React.useState(false);

  // Role-filtered notifications
  const roleNotifications = notifications.filter(
    (n) => n.targetRole === currentRole || n.targetRole === 'all'
  );
  const unreadCount = roleNotifications.filter((n) => !n.read).length;

  // Role-Specific Navigation Links
  const navConfig = {
    government: [
      { id: 'dashboard', label: 'Dashboard' },
      { id: 'workflow', label: '🔄 Workflow & 12-Step Architecture' },
      { id: 'map', label: 'Flood Map' },
      { id: 'hotspots', label: 'Hotspots' },
      { id: 'incidents', label: 'Incidents' },
      { id: 'assets', label: 'Assets' },
      { id: 'professors', label: '🎓 Prof. Complaints & Escalations' },
    ],
    admin: [
      { id: 'operations', label: 'Operations' },
      { id: 'workflow', label: '🔄 Workflow & 12-Step Architecture' },
      { id: 'map', label: 'Flood Map' },
      { id: 'hotspots', label: 'Hotspots' },
      { id: 'incidents', label: 'Incidents' },
      { id: 'assets', label: 'Assets' },
      { id: 'professors', label: '🎓 Prof. Complaints & Escalations' },
    ],
    citizen: [
      { id: 'risk', label: 'Flood Risk' },
      { id: 'map', label: 'Flood Map' },
      { id: 'saferoute', label: 'Safe Route' },
      { id: 'report', label: 'Report Flood' },
      { id: 'reportStatus', label: 'Track Status' },
    ],
  };

  const navItems = navConfig[currentRole] || navConfig.government;

  const handleNavClick = (id) => {
    if (currentRole === 'citizen') {
      if (id === 'saferoute') {
        setActiveModal('safeRoute');
        if (setActiveNav) setActiveNav('saferoute');
      } else if (id === 'report') {
        setActiveModal('reportFlood');
        if (setActiveNav) setActiveNav('report');
      } else if (id === 'map') {
        setActiveModal(null);
        if (setActiveNav) setActiveNav('map');
      } else {
        setActiveModal(null);
        if (setActiveNav) setActiveNav('risk');
      }
      return;
    }

    if (currentRole === 'admin') {
      if (setActiveNav) setActiveNav(id);
      return;
    }

    if (currentRole === 'government') {
      if (setActiveNav) setActiveNav(id);
    }
  };

  const getRoleBadgeLabel = () => {
    if (currentRole === 'government') return 'Government Control Room • Logged in';
    if (currentRole === 'admin') return 'Super-Administrator • Logged in';
    return 'Citizen • Logged in';
  };

  return (
    <header className="gov-header-wrapper">
      {/* Subtle Government Portal Top Strip */}
      <div className="gov-top-strip">
        <div className="top-strip-inner">
          <span className="strip-text">
            <strong>SIH 2026</strong> &nbsp;|&nbsp; Urban Flood Nowcasting + Response Intelligence &nbsp;|&nbsp; Problem Statement 26085
          </span>
          <span className="strip-right-tag">Physics-First 1D/2D Intelligence &amp; Risk-Aware Routing</span>
        </div>
      </div>

      {/* Main White Header */}
      <div className="gov-main-header">
        <div className="header-brand-container">
          <div className="brand-logo-container">
            <img src={logoImg} alt="Urban Flood Intelligence System Logo" className="brand-logo-img" />
          </div>
          <div className="brand-text-group">
            <h1 className="brand-primary-title">Urban Flood Nowcasting + Response Intelligence</h1>
            <p className="brand-secondary-subtitle">0–3 Hour Street-Level Risk, Hotspots &amp; Risk-Aware Routing</p>
          </div>
        </div>

        {/* Role-Specific Navigation Links */}
        <nav className="header-primary-nav" aria-label="Role Navigation">
          {navItems.map((item) => {
            const isActive = activeNav === item.id || (currentRole === 'citizen' && item.id === 'risk' && (activeNav === 'dashboard' || activeNav === 'risk'));
            return (
              <button
                key={item.id}
                className={`gov-nav-link ${isActive ? 'active' : ''}`}
                onClick={() => handleNavClick(item.id)}
              >
                {item.label}
              </button>
            );
          })}
        </nav>

        {/* Right Header Utilities & Read-Only Role Indicator */}
        <div className="header-right-utilities">
          {/* Notification Bell with Badge Counter */}
          <div style={{ position: 'relative' }}>
            <button
              className="gov-btn-secondary"
              onClick={() => setShowNotifDropdown(!showNotifDropdown)}
              style={{
                position: 'relative',
                padding: '6px 10px',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                fontSize: '12px',
              }}
              title="System Alerts & Directives"
            >
              <Bell size={15} style={{ color: unreadCount > 0 ? '#BE123C' : 'var(--text-secondary)' }} />
              {unreadCount > 0 && (
                <span
                  style={{
                    background: '#BE123C',
                    color: '#FFFFFF',
                    borderRadius: '10px',
                    padding: '1px 6px',
                    fontSize: '10px',
                    fontWeight: 800,
                  }}
                >
                  {unreadCount}
                </span>
              )}
            </button>

            {/* Notifications Dropdown Popup */}
            {showNotifDropdown && (
              <div
                style={{
                  position: 'absolute',
                  right: 0,
                  top: '110%',
                  width: '340px',
                  background: '#FFFFFF',
                  border: '1px solid #CBD5E1',
                  borderRadius: '6px',
                  boxShadow: '0 10px 25px rgba(0,0,0,0.15)',
                  zIndex: 9999,
                  padding: '12px',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px', borderBottom: '1px solid #E2E8F0', pb: '6px' }}>
                  <strong style={{ fontSize: '13px', color: '#0F172A' }}>Notifications &amp; Directives</strong>
                  <span style={{ fontSize: '11px', color: '#64748B' }}>{roleNotifications.length} alerts</span>
                </div>

                <div style={{ maxHeight: '280px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  {roleNotifications.length === 0 ? (
                    <div style={{ fontSize: '12px', color: '#64748B', textAlign: 'center', padding: '12px' }}>
                      No unread system directives.
                    </div>
                  ) : (
                    roleNotifications.map((notif) => (
                      <div
                        key={notif.id}
                        onClick={() => markNotificationAsRead(notif.id)}
                        style={{
                          padding: '8px 10px',
                          borderRadius: '4px',
                          background: notif.read ? '#F8FAFC' : '#EFF6FF',
                          borderLeft: notif.read ? '3px solid #CBD5E1' : '3px solid #0284C7',
                          cursor: 'pointer',
                        }}
                      >
                        <div style={{ fontSize: '12px', fontWeight: 700, color: '#1E293B', marginBottom: '2px' }}>
                          {notif.title}
                        </div>
                        <div style={{ fontSize: '11px', color: '#334155', lineHeight: '1.3' }}>
                          {notif.message}
                        </div>
                        <div style={{ fontSize: '10px', color: '#94A3B8', marginTop: '4px', display: 'flex', justifyContent: 'space-between' }}>
                          <span>{notif.time} • {notif.sender}</span>
                          {!notif.read && <span style={{ color: '#0284C7', fontWeight: 700 }}>● New</span>}
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </div>

          {/* READ-ONLY Session Indicator */}
          <div className="gov-role-read-only-badge" title="Role locked for current authenticated session">
            <Lock size={12} className="lock-icon" />
            <span className="role-read-only-text">{getRoleBadgeLabel()}</span>
          </div>

          <div className="system-status-indicator">
            <span className="status-dot-green"></span>
            <span className="status-status-text">Physics Engine Online</span>
          </div>

          <div className="user-profile-summary">
            <span className="user-name">{user.name || 'Control Room Officer'}</span>
          </div>

          {/* Session Logout Button */}
          <button
            className="gov-logout-btn"
            onClick={logout}
            title="Logout of session and clear role"
          >
            <LogOut size={14} />
            <span>Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
