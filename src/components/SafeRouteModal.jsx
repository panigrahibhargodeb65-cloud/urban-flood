import React, { useState } from 'react';
import { X, Navigation, MapPin, Building2, ShieldCheck, AlertTriangle } from 'lucide-react';

export default function SafeRouteModal({ isOpen, onClose }) {
  const [navStarted, setNavStarted] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="gov-modal-backdrop" onClick={onClose}>
      <div className="gov-modal-box route-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">Risk-Aware Emergency Navigation (Sambalpur Network)</h3>
          <button className="gov-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-content">
          {/* Priority Note */}
          <div className="route-priority-note">
            <span className="font-semibold">Routing Algorithm Priority:</span> 1. SAFETY &nbsp; 2. Flood severity &nbsp; 3. Corridor risk penalty &nbsp; 4. Travel time
          </div>

          <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', padding: '8px 12px', borderRadius: '4px', fontSize: '11px', color: '#475569', marginBottom: '12px' }}>
            <strong>Risk-Aware Disclaimer:</strong> Routing penalizes or blocks high-risk/critical roads based on 0–3hNowcast predictions. It is risk-aware guidance, not a 100% guarantee of safety.
          </div>

          {/* Route Flow */}
          <div className="route-flow-container">
            <div className="route-node origin-node">
              <MapPin size={16} className="node-icon text-blue" />
              <span className="node-text">Origin: Dhanupali / Sakhipara</span>
            </div>

            <div className="route-connector-line">
              <span className="connector-label">↓ Bareipali Northern Bypass Corridor (Penalizes Flooded Corridors) ↓</span>
            </div>

            <div className="route-node dest-node">
              <Building2 size={16} className="node-icon text-safe" />
              <span className="node-text">Destination: VIMSAR District Hospital</span>
            </div>
          </div>

          {/* Route Options Breakdown */}
          <div className="route-options-list">
            <h4 className="options-title">Road Risk Safety Breakdown:</h4>

            <div className="route-option-card safe-option">
              <div className="opt-header">
                <span className="opt-status text-safe">● SAFE (Recommended)</span>
                <span className="opt-time">14 min (12.4 km)</span>
              </div>
              <p className="opt-desc">Via Bareipali Northern Bypass Flyover — Dry corridor, zero depth (0 cm).</p>
            </div>

            <div className="route-option-card restricted-option">
              <div className="opt-header">
                <span className="opt-status text-moderate">● CAUTION (Restricted)</span>
                <span className="opt-time">11 min (4.2 km)</span>
              </div>
              <p className="opt-desc">Via Budharaja Commercial Street — Shallow water accumulation (15 cm), slow moving traffic.</p>
            </div>

            <div className="route-option-card avoid-option">
              <div className="opt-header">
                <span className="opt-status text-critical">● CRITICAL / BLOCKED (Penalized)</span>
                <span className="opt-time">Shortest Path (3.1 km)</span>
              </div>
              <p className="opt-desc">Via Khetrajpur Station Underpass — CRITICAL FLOODING (82 cm depth, unpassable).</p>
            </div>
          </div>

          {/* Actions */}
          <div className="modal-actions-row">
            {navStarted ? (
              <div className="gov-alert alert-success full-width" style={{ textAlign: 'center' }}>
                Navigation active on Bareipali Risk-Aware Bypass Corridor. Following real-time nowcast safety directives.
              </div>
            ) : (
              <button
                className="gov-btn-primary full-width"
                onClick={() => setNavStarted(true)}
              >
                Start Risk-Aware Navigation
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
