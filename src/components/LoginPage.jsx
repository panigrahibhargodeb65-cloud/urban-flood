import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import Footer from './Footer';
import { Lock, CheckCircle2, Building2, ShieldAlert, User } from 'lucide-react';
import logoImg from '../assets/logo.png';

export default function LoginPage() {
  const { login } = useApp();
  const [selectedRole, setSelectedRole] = useState('government');
  const [emailOrPhone, setEmailOrPhone] = useState('admin@urbanflood.gov.in');
  const [password, setPassword] = useState('••••••••••••');
  const [rememberMe, setRememberMe] = useState(true);
  const [authStatus, setAuthStatus] = useState(null);

  const roles = [
    {
      id: 'government',
      label: 'Government',
      icon: Building2,
      subtitle: 'Municipal & Disaster Management Officers',
    },
    {
      id: 'admin',
      label: 'Admin',
      icon: ShieldAlert,
      subtitle: 'Control Room Operations & Incident Management',
    },
    {
      id: 'citizen',
      label: 'Citizen',
      icon: User,
      subtitle: 'Public Access for Flood Risk & Reporting',
    },
  ];

  const activeRoleObj = roles.find((r) => r.id === selectedRole) || roles[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!emailOrPhone || !password) {
      setAuthStatus({
        type: 'error',
        message: 'Please enter your login credentials.',
      });
      return;
    }

    setAuthStatus({
      type: 'success',
      message: `Authenticated as ${activeRoleObj.label}. Accessing portal...`,
    });

    setTimeout(() => {
      login(selectedRole);
    }, 400);
  };

  return (
    <div className="gov-login-root">
      {/* Top Strip */}
      <div className="gov-top-strip">
        <div className="top-strip-inner">
          <span className="strip-text">
            <strong>Smart India Hackathon 2026</strong> &nbsp;|&nbsp; Urban Flood Intelligence System &nbsp;|&nbsp; PS 26085
          </span>
          <span className="strip-right-tag">Official Demonstration Portal</span>
        </div>
      </div>

      {/* Main Login Area */}
      <main className="gov-login-main" id="main-content">
        <div className="gov-login-card">
          {/* Top Brand Header */}
          <div className="login-card-header">
            <div className="login-logo-container">
              <img src={logoImg} alt="Urban Flood Intelligence System Logo" className="login-logo-img" />
            </div>
            <h1 className="login-title">Urban Flood Intelligence System</h1>
            <p className="login-subtitle">Smart Urban Flood Monitoring &amp; Response</p>
            <p className="login-ps-line">Smart India Hackathon — Problem Statement 26085</p>
          </div>

          {/* 3-Tab Role Selector (Authentication-time ONLY) */}
          <div className="role-tabs-container" role="tablist" aria-label="Role Selection">
            {roles.map((role) => {
              const IconComponent = role.icon;
              const isActive = selectedRole === role.id;
              return (
                <button
                  key={role.id}
                  type="button"
                  role="tab"
                  aria-selected={isActive}
                  className={`role-tab ${isActive ? 'active' : ''}`}
                  onClick={() => {
                    setSelectedRole(role.id);
                    setAuthStatus(null);
                  }}
                >
                  <IconComponent size={15} />
                  <span>{role.label}</span>
                </button>
              );
            })}
          </div>

          <div className="role-description-text">
            <span>{activeRoleObj.subtitle}</span>
          </div>

          {/* Auth Feedback alert */}
          {authStatus && (
            <div className={`gov-alert alert-${authStatus.type}`} role="alert">
              {authStatus.type === 'success' && <CheckCircle2 size={16} />}
              <span>{authStatus.message}</span>
            </div>
          )}

          {/* Login Form */}
          <form onSubmit={handleSubmit} className="gov-login-form">
            <div className="form-field">
              <label className="gov-form-label" htmlFor="emailOrPhone">
                Email / Phone
              </label>
              <input
                id="emailOrPhone"
                type="text"
                className="gov-form-input"
                placeholder="Enter email or registered phone number"
                value={emailOrPhone}
                onChange={(e) => setEmailOrPhone(e.target.value)}
                autoComplete="username"
                required
              />
            </div>

            <div className="form-field">
              <label className="gov-form-label" htmlFor="password">
                Password
              </label>
              <input
                id="password"
                type="password"
                className="gov-form-input"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
              />
            </div>

            <div className="form-row-options">
              <label className="gov-checkbox-label">
                <input
                  type="checkbox"
                  className="gov-checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                <span>Remember me</span>
              </label>

              <button
                type="button"
                className="gov-link-btn"
                onClick={() => alert('Password reset link dispatched to authorized user contact.')}
              >
                Forgot password?
              </button>
            </div>

            <button type="submit" className="gov-btn-primary full-width">
              Sign In as {activeRoleObj.label}
            </button>
          </form>

          <div className="login-card-footer-note">
            <Lock size={13} className="lock-icon" />
            <span>Secure access to flood intelligence and response tools.</span>
          </div>
        </div>
      </main>

      {/* Government Footer */}
      <Footer />
    </div>
  );
}
