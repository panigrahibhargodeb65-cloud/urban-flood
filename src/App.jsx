import React, { useState, useEffect } from 'react';
import { AppProvider, useApp } from './context/AppContext';
import LoginPage from './components/LoginPage';
import GovernmentDashboard from './components/GovernmentDashboard';
import HotspotDetailsPage from './components/HotspotDetailsPage';
import AdminOperationsPage from './components/AdminOperationsPage';
import CitizenPage from './components/CitizenPage';
import ReportingStatusPage from './components/ReportingStatusPage';
import ProfessorComplaintsView from './components/ProfessorComplaintsView';
import ProtectedRoute from './components/ProtectedRoute';
import GlobalHeader from './components/GlobalHeader';
import Footer from './components/Footer';

function MainRouter() {
  const { auth } = useApp();
  const [activeNav, setActiveNav] = useState('dashboard');

  // Reset active sub-nav whenever authenticated role changes
  useEffect(() => {
    if (auth?.role === 'government') {
      setActiveNav('dashboard');
    } else if (auth?.role === 'admin') {
      setActiveNav('operations');
    } else if (auth?.role === 'citizen') {
      setActiveNav('risk');
    }
  }, [auth?.role]);

  // If not authenticated, render Login Page
  if (!auth || !auth.isAuthenticated) {
    return (
      <>
        <a href="#main-content" className="gov-skip-link">
          Skip to main content
        </a>
        <LoginPage />
      </>
    );
  }

  // Render role-protected workspace based on locked session role
  return (
    <div className="post-login-root">
      <a href="#main-content" className="gov-skip-link">
        Skip to main content
      </a>

      <div className="post-login-content-layer">
        {auth.role === 'government' && (
          <ProtectedRoute allowedRoles={['government']}>
            {activeNav === 'hotspots' ? (
              <HotspotDetailsPage
                setActiveNav={setActiveNav}
                onBackToDashboard={() => setActiveNav('dashboard')}
              />
            ) : activeNav === 'professors' ? (
              <div className="gov-page-root">
                <GlobalHeader activeNav={activeNav} setActiveNav={setActiveNav} />
                <main className="gov-dashboard-main">
                  <ProfessorComplaintsView />
                </main>
                <Footer />
              </div>
            ) : (
              <GovernmentDashboard activeNav={activeNav} setActiveNav={setActiveNav} />
            )}
          </ProtectedRoute>
        )}

        {auth.role === 'admin' && (
          <ProtectedRoute allowedRoles={['admin']}>
            {activeNav === 'professors' ? (
              <div className="gov-page-root">
                <GlobalHeader activeNav={activeNav} setActiveNav={setActiveNav} />
                <main className="gov-dashboard-main">
                  <ProfessorComplaintsView />
                </main>
                <Footer />
              </div>
            ) : (
              <AdminOperationsPage activeNav={activeNav} setActiveNav={setActiveNav} />
            )}
          </ProtectedRoute>
        )}

        {auth.role === 'citizen' && (
          <ProtectedRoute allowedRoles={['citizen']}>
            {activeNav === 'reportStatus' ? (
              <ReportingStatusPage onBack={() => setActiveNav('risk')} setActiveNav={setActiveNav} />
            ) : (
              <CitizenPage activeNav={activeNav} setActiveNav={setActiveNav} />
            )}
          </ProtectedRoute>
        )}
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AppProvider>
      <MainRouter />
    </AppProvider>
  );
}
