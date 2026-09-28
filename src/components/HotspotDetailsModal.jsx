import React from 'react';
import { X } from 'lucide-react';
import { TIMELINE_STEPS } from '../data/centralData';

export default function HotspotDetailsModal({ hotspot, isOpen, onClose }) {
  if (!isOpen || !hotspot) return null;

  const affectedRoads = hotspot.affectedRoads || ['Station Road', 'Railway Link Road'];

  return (
    <div className="gov-modal-backdrop" onClick={onClose}>
      <div className="gov-modal-box report-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">Flood Intelligence Report — {hotspot.name} ({hotspot.code || '#03'})</h3>
          <button className="gov-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-content">
          <div className="target-summary-box">
            <span className="d-label">Zone: {hotspot.zone}</span>
            <h2 className="d-val font-semibold">{hotspot.name}</h2>
            <div style={{ fontSize: '11px', color: '#0284C7', fontWeight: 700, marginTop: '4px' }}>
              Physics Gate: {hotspot.physicsGateStatus || 'AUTHORITATIVE'}
            </div>
          </div>

          <div className="gov-section-box">
            <h4 className="section-heading">0–3 Hour Depth Hydrograph Forecast (Centimetres)</h4>
            <div className="clean-bar-chart">
              {TIMELINE_STEPS.map((step) => {
                const info = hotspot.timelineData[step.id] || hotspot.timelineData.now;
                const depthCm = info.depthCm || Math.round(info.depth * 100);
                const heightPct = Math.min(100, Math.max(12, (info.depth / 1.0) * 100));
                const color =
                  info.severity === 'CRITICAL'
                    ? '#B91C1C'
                    : info.severity === 'HIGH'
                    ? '#C2410C'
                    : info.severity === 'MODERATE'
                    ? '#B77900'
                    : '#0284C7';

                return (
                  <div key={step.id} className="bar-column">
                    <span className="bar-val-text" style={{ fontWeight: 700 }}>{depthCm} cm</span>
                    <div className="bar-track">
                      <div
                        className="bar-fill"
                        style={{ height: `${heightPct}%`, backgroundColor: color }}
                      />
                    </div>
                    <span className="bar-label-text">{step.label}</span>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="gov-section-box">
            <h4 className="section-heading">Hydraulic &amp; Environmental Cause Analysis</h4>
            <p><strong>Primary Cause:</strong> {hotspot.cause}</p>
            <p className="text-muted" style={{ fontSize: '13px', marginTop: '4px' }}>
              Model estimated 1D/2D drainage surcharge exceeding localized storm sewer network capacity.
            </p>
          </div>

          <div className="gov-section-box">
            <h4 className="section-heading">Affected Corridors &amp; Road Risk</h4>
            <ul className="citizen-reports-list">
              {affectedRoads.map((road, idx) => (
                <li key={idx} className="citizen-report-item">
                  <span>{road}</span>
                  <span className="status-tag" style={{ background: '#FEE2E2', color: '#B91C1C', fontWeight: 700, fontSize: '11px' }}>
                    {hotspot.roadRiskCategory || 'HIGH_RISK'}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          <div className="modal-actions-row">
            <button className="gov-btn-primary full-width" onClick={onClose}>
              Close Report
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
