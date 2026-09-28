import React from 'react';
import { useApp } from '../context/AppContext';
import LoginPage from './LoginPage';

export default function ProtectedRoute({ allowedRoles, children }) {
  const { auth, logout } = useApp();

  // 1. If not authenticated, force Login page
  if (!auth || !auth.isAuthenticated) {
    return <LoginPage />;
  }

  // 2. If authenticated role is not in allowedRoles, block access & show clean alert
  if (!allowedRoles.includes(auth.role)) {
    return (
      <div className="gov-page-root">
        <div className="gov-main-header" style={{ padding: '16px 24px', background: '#FFFFFF', borderBottom: '1px solid #E5E7EB' }}>
          <span style={{ fontWeight: 700, color: '#0284C7' }}>Urban Flood Intelligence System</span>
          <button className="gov-logout-btn" onClick={logout}>Logout</button>
        </div>
        <div style={{ maxWidth: '600px', margin: '60px auto', padding: '24px', background: '#FFFFFF', border: '1px solid #D1D5DB', borderRadius: '4px', textAlign: 'center' }}>
          <h2 style={{ fontSize: '20px', color: '#B91C1C', marginBottom: '12px' }}>Access Restricted</h2>
          <p style={{ fontSize: '14px', color: '#374151', marginBottom: '16px' }}>
            Your current logged-in role (<strong>{auth.user?.title || auth.role}</strong>) does not have permission to access this module.
          </p>
          <button className="gov-btn-primary" onClick={logout}>
            Logout &amp; Switch Role
          </button>
        </div>
      </div>
    );
  }

  // 3. Authorized -> render protected view
  return children;
}
