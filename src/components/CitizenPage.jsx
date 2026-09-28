import React from 'react';
import { useApp } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import SafeRouteModal from './SafeRouteModal';
import ReportFloodModal from './ReportFloodModal';
import GovernmentMapView from './GovernmentMapView';
import Footer from './Footer';
import { MapPin, AlertTriangle, ShieldCheck } from 'lucide-react';

export default function CitizenPage({ activeNav = 'risk', setActiveNav }) {
  const {
    activeModal,
    setActiveModal,
    citizenReports,
    selectedHotspot,
    currentStepId,
    selectHotspot,
    hotspots,
  } = useApp();

  const isRouteModalOpen = activeModal === 'safeRoute';
  const isReportModalOpen = activeModal === 'reportFlood';

  const stepInfo = selectedHotspot.timelineData[currentStepId] || selectedHotspot.timelineData.now;
  const depthCm = stepInfo.depthCm || Math.round(stepInfo.depth * 100);

  const handleLocationChange = () => {
    // Cycle through hotspots to simulate location change
    const currentIndex = hotspots.findIndex((h) => h.id === selectedHotspot.id);
    const nextIndex = (currentIndex + 1) % hotspots.length;
    selectHotspot(hotspots[nextIndex].id);
  };

  const getRiskTextAndColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return { text: '● CRITICAL FLOOD RISK', class: 'text-critical' };
      case 'HIGH':
        return { text: '● HIGH FLOOD RISK', class: 'text-high' };
      case 'MODERATE':
        return { text: '● MODERATE FLOOD RISK', class: 'text-moderate' };
      default:
        return { text: '● SAFE / MINIMAL RISK', class: 'text-safe' };
    }
  };

  const riskInfo = getRiskTextAndColor(stepInfo.severity);

  const handleCloseModal = () => {
    setActiveModal(null);
    if (setActiveNav) setActiveNav('risk');
  };

  return (
    <div className="gov-page-root">
      {/* Header */}
      <GlobalHeader activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="gov-citizen-main" id="main-content">
        {activeNav === 'map' ? (
          <GovernmentMapView />
        ) : (
          <>
        {/* Sub-Header Bar */}
        <div className="citizen-location-bar">
          <div>
            <h1 className="citizen-page-heading">Citizen Flood Risk &amp; Travel Nowcast</h1>
            <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
              Real-time street flood warnings, onset timing, water depth, and risk-aware travel directions.
            </p>
          </div>
          <div className="citizen-location-picker">
            <MapPin size={15} className="location-pin-icon" />
            <span>Location: <strong>{selectedHotspot.name}</strong></span>
            <button className="gov-btn-link-sm" onClick={handleLocationChange}>
              [Change Area]
            </button>
          </div>
        </div>

        {/* Main Status Display in CENTIMETRES */}
        <div className="citizen-status-card">
          <div className={`citizen-risk-badge ${riskInfo.class}`}>
            <span className="risk-symbol font-bold">{riskInfo.text}</span>
          </div>

          <h2 className="citizen-area-title">{selectedHotspot.name} Area ({selectedHotspot.code || '#03'})</h2>

          <div className="citizen-metrics-grid">
            <div className="citizen-metric-box">
              <span className="c-label">Water depth:</span>
              <span className="c-value" style={{ color: '#0284C7', fontWeight: 800 }}>{depthCm} cm</span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>({stepInfo.depth.toFixed(2)}m)</span>
            </div>

            <div className="citizen-metric-box">
              <span className="c-label">Expected onset:</span>
              <span className="c-value">
                {stepInfo.onset === 0 ? 'Active Now' : `${stepInfo.onset} min`}
              </span>
              <span style={{ fontSize: '11px', color: '#64748B' }}>Duration: {stepInfo.duration} min</span>
            </div>
          </div>

          {/* Road Status & Travel Info */}
          <div className="citizen-road-status-box">
            <span className="road-status-title">Risk-Aware Travel Advisory:</span>
            <span className="road-status-text risk-high-text" style={{ display: 'block', marginTop: '2px' }}>
              {selectedHotspot.routingRecommendation || 'Diversion recommended — Avoid low-lying corridors.'}
            </span>
          </div>
        </div>

        {/* Main Action Buttons — Largest Controls */}
        <div className="citizen-main-actions">
          <button
            className="gov-btn-citizen-large btn-route-primary"
            onClick={() => {
              setActiveModal('safeRoute');
              if (setActiveNav) setActiveNav('saferoute');
            }}
          >
            Find Risk-Aware Safe Route →
          </button>

          <button
            className="gov-btn-citizen-large btn-report-secondary"
            onClick={() => {
              setActiveModal('reportFlood');
              if (setActiveNav) setActiveNav('report');
            }}
          >
            Report Flood Field Evidence 📷
          </button>
        </div>

        {/* Nearby Verified Reports */}
        <div className="citizen-reports-section">
          <h3 className="citizen-section-heading">Nearby Citizen Field Evidence</h3>
          <p style={{ fontSize: '11px', color: 'var(--text-muted)', marginBottom: '8px' }}>
            Citizen observations serve as validation evidence for control room predictions.
          </p>
          <ul className="citizen-reports-list">
            {citizenReports.map((rep) => (
              <li
                key={rep.id}
                className="citizen-report-item clickable-report-item"
                onClick={() => {
                  setActiveModal(null);
                  if (setActiveNav) setActiveNav('reportStatus');
                }}
                title="Tap report to view detailed status"
              >
                <div className="report-item-header">
                  <span className="rep-location">{rep.location}</span>
                  <span className="risk-high-text font-semibold">
                    {rep.depthText.includes('Waist') || rep.depthText.includes('1 m') ? '● CRITICAL' : '● HIGH'}
                  </span>
                </div>
                <span className="rep-time-text">{rep.time} • Depth: <strong>{rep.depthText}</strong> ({rep.category})</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Prediction Confidence & Physics Authoritative Footer */}
        <div className="citizen-meta-footer">
          <p>
            <strong>Physics-First Model Confidence:</strong> {selectedHotspot.confidence || '91%'} &nbsp;|&nbsp;{' '}
            <strong>Last updated:</strong> Live System Nowcast
          </p>
          <p className="sources-text">
            <strong>Fused Sources:</strong> Weather Radar nowcast, Rain gauges, 1D SWMM + 2D surface physics, Telemetry, Citizen reports
          </p>
        </div>
        </>
        )}
      </main>

      {/* Safe Route Modal */}
      <SafeRouteModal
        isOpen={isRouteModalOpen}
        onClose={handleCloseModal}
      />

      {/* Report Flood Modal */}
      <ReportFloodModal
        isOpen={isReportModalOpen}
        onClose={handleCloseModal}
      />

      <Footer />
    </div>
  );
}
