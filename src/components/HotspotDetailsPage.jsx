import React from 'react';
import { useApp } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import Footer from './Footer';
import { ArrowLeft, ShieldCheck, Cpu, AlertTriangle } from 'lucide-react';
import { TIMELINE_STEPS } from '../data/centralData';

export default function HotspotDetailsPage({ setActiveNav, onBackToDashboard }) {
  const {
    selectedHotspot,
    currentStepId,
    createIncident,
    setActiveModal,
  } = useApp();

  const hotspot = selectedHotspot;
  const stepInfo = hotspot.timelineData[currentStepId] || hotspot.timelineData.now;
  const depthCm = stepInfo.depthCm || Math.round(stepInfo.depth * 100);

  const statusWorkflowSteps = [
    { id: 'REPORTED', label: 'Reported' },
    { id: 'VALIDATED', label: 'Validated' },
    { id: 'ASSIGNED', label: 'Assigned' },
    { id: 'IN_PROGRESS', label: 'In Progress' },
    { id: 'RESOLVED', label: 'Resolved' },
  ];

  const currentStatusIndex = statusWorkflowSteps.findIndex(
    (s) => s.id === hotspot.incidentStatus
  );

  return (
    <div className="gov-page-root">
      <GlobalHeader activeNav="hotspots" setActiveNav={setActiveNav} />

      <main className="gov-details-page-main" id="main-content">
        {/* Back Link */}
        <div className="back-link-wrapper">
          <button className="gov-back-btn" onClick={onBackToDashboard}>
            <ArrowLeft size={16} />
            <span>Back to Dashboard</span>
          </button>
        </div>

        {/* Intelligence Report Header */}
        <div className="report-header">
          <div>
            <span className="report-subtext">Urban Flood Nowcasting + Response Intelligence</span>
            <h1 className="report-title">{hotspot.name} ({hotspot.code || '#03'})</h1>
            <div className="report-meta">
              <span>Updated 2 minutes ago</span>
              <span className="meta-sep">•</span>
              <span>Prediction confidence: <strong>{hotspot.confidence}</strong></span>
              <span className="meta-sep">•</span>
              <span>Physics gate: <strong style={{ color: '#0284C7' }}>{hotspot.physicsGateStatus || 'AUTHORITATIVE'}</strong></span>
            </div>
          </div>
          <span className="risk-badge-large risk-critical-badge">
            ● {stepInfo.severity} FLOOD RISK
          </span>
        </div>

        {/* 4 Prominent Key Information Blocks in CENTIMETRES */}
        <div className="key-info-grid">
          <div className="info-block">
            <span className="info-block-value" style={{ color: '#0284C7' }}>{depthCm} cm</span>
            <span className="info-block-label">Flood depth ({stepInfo.depth.toFixed(2)}m)</span>
          </div>

          <div className="info-block">
            <span className="info-block-value">
              {stepInfo.onset === 0 ? 'Active' : `${stepInfo.onset} min`}
            </span>
            <span className="info-block-label">Expected onset</span>
          </div>

          <div className="info-block">
            <span className="info-block-value">{stepInfo.duration} min</span>
            <span className="info-block-label">Expected duration</span>
          </div>

          <div className="info-block">
            <span className="info-block-value">{hotspot.incidentPriority || 'P1'}</span>
            <span className="info-block-label">Incident priority</span>
          </div>
        </div>

        {/* Incident Status Tracker */}
        <div className="gov-section-box">
          <h2 className="section-heading">Incident Status &amp; Response Progress</h2>
          <div className="horizontal-status-tracker">
            {statusWorkflowSteps.map((step, idx) => {
              const isCompleted = idx <= (currentStatusIndex < 0 ? 1 : currentStatusIndex);
              const isCurrent = idx === (currentStatusIndex < 0 ? 1 : currentStatusIndex);

              return (
                <React.Fragment key={step.id}>
                  <div className={`status-tracker-node ${isCurrent ? 'current' : isCompleted ? 'completed' : ''}`}>
                    <span className="node-number">{idx + 1}</span>
                    <span className="node-label">{step.label}</span>
                  </div>
                  {idx < statusWorkflowSteps.length - 1 && (
                    <span className={`status-tracker-arrow ${isCompleted ? 'active-arrow' : ''}`}>→</span>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Grid of Details: Forecast, Causes, Affected Roads, Critical Assets */}
        <div className="report-sections-grid">
          {/* Flood Forecast Graph in Centimetres */}
          <div className="gov-section-box">
            <h2 className="section-heading">Flood Forecast Hydrograph (0–3 Hours in cm)</h2>
            <div className="clean-bar-chart">
              {TIMELINE_STEPS.map((step) => {
                const info = hotspot.timelineData[step.id] || hotspot.timelineData.now;
                const dCm = info.depthCm || Math.round(info.depth * 100);
                const heightPct = Math.min(100, Math.max(12, (info.depth / 1.0) * 100));
                const barColor =
                  info.severity === 'CRITICAL'
                    ? '#B91C1C'
                    : info.severity === 'HIGH'
                    ? '#C2410C'
                    : info.severity === 'MODERATE'
                    ? '#B77900'
                    : '#0284C7';

                return (
                  <div key={step.id} className="bar-column">
                    <span className="bar-val-text" style={{ fontWeight: 700 }}>{dCm} cm</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ height: `${heightPct}%`, backgroundColor: barColor }}
                      />
                    </div>
                    <span className="bar-label-text">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Likely Cause Breakdown & Synthetic Provenance */}
          <div className="gov-section-box">
            <h2 className="section-heading">Coupled 1D/2D Cause Analysis</h2>
            <p className="cause-tagline">Physics-first hydraulic diagnosis:</p>
            <div className="cause-list">
              <div className="cause-item">
                <span className="cause-badge cause-primary">Primary:</span>
                <span className="cause-desc">{hotspot.cause}</span>
              </div>
              <div className="cause-item">
                <span className="cause-badge cause-contributing">Coupling:</span>
                <span className="cause-desc">1D SWMM surcharge → 2D surface flow ponding</span>
              </div>
              <div className="cause-item">
                <span className="cause-badge cause-possible">Urban Effect:</span>
                <span className="cause-desc">Dynamic inlet clogging &amp; obstacle drag</span>
              </div>
            </div>

            <div style={{ marginTop: '12px', background: '#FEF3C7', padding: '8px 12px', borderRadius: '4px', borderLeft: '3px solid #D97706', fontSize: '11px', color: '#78350F' }}>
              <strong>Synthetic Assumption Provenance:</strong> {hotspot.syntheticProvenance || 'Explicitly labelled synthetic topography assumption'}
            </div>
          </div>

          {/* Affected Roads Table */}
          <div className="gov-section-box">
            <h2 className="section-heading">Affected Road Corridors &amp; Risk</h2>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Road Corridor</th>
                  <th>Risk Category</th>
                  <th>Routing Directive</th>
                </tr>
              </thead>
              <tbody>
                {(hotspot.affectedRoadsList || ['Station Road', 'Market Link Road']).map((road, i) => (
                  <tr key={i}>
                    <td>{road}</td>
                    <td className="risk-critical-text">● {hotspot.roadRiskCategory || 'HIGH_RISK'}</td>
                    <td>{hotspot.routingRecommendation || 'Diversion recommended'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Critical Assets List */}
          <div className="gov-section-box">
            <h2 className="section-heading">Nearby Critical Municipal Assets</h2>
            <table className="gov-table">
              <thead>
                <tr>
                  <th>Asset</th>
                  <th>Distance</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {hotspot.nearbyAssets.map((ast, idx) => (
                  <tr key={idx}>
                    <td>{ast.name}</td>
                    <td>{ast.distance}</td>
                    <td className="risk-high-text">At Risk / Protected</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="report-actions-row">
          <button
            className="gov-btn-secondary btn-outline-warning"
            onClick={() => createIncident(hotspot)}
          >
            Create Incident
          </button>
          <button
            className="gov-btn-primary"
            onClick={() => setActiveModal('assign')}
          >
            Assign Response
          </button>
        </div>
      </main>

      <Footer />
    </div>
  );
}
