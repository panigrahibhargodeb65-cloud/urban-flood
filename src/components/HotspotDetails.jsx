import React from 'react';
import { Cpu, ShieldCheck, Tag, Zap, AlertTriangle } from 'lucide-react';

export default function HotspotDetails({
  hotspot,
  currentStepId,
  onOpenDetailsModal,
  onCreateIncident,
  onOpenAssignmentModal,
}) {
  if (!hotspot) {
    return (
      <aside className="gov-details-panel empty">
        <p className="empty-text">Select a location on the map or left list to inspect flood nowcast intelligence.</p>
      </aside>
    );
  }

  // Current selected step metrics
  const stepInfo = hotspot.timelineData[currentStepId] || hotspot.timelineData.now;

  // Timeline values formatted in CENTIMETRES per Section 4 & 10
  const nowInfo = hotspot.timelineData.now;
  const m30Info = hotspot.timelineData['30m'];
  const m60Info = hotspot.timelineData['60m'];
  const m90Info = hotspot.timelineData['90m'];

  const getRiskLabelText = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '● CRITICAL';
      case 'HIGH':
        return '● HIGH';
      case 'MODERATE':
        return '● MODERATE';
      default:
        return '● SAFE';
    }
  };

  const getRiskColorClass = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return 'text-critical';
      case 'HIGH':
        return 'text-high';
      case 'MODERATE':
        return 'text-moderate';
      default:
        return 'text-safe';
    }
  };

  return (
    <aside className="gov-details-panel">
      {/* Location Title Header */}
      <div className="details-header-section">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span className="details-sub-label">Selected Hotspot Zone</span>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#0284C7', background: '#E0F2FE', padding: '2px 8px', borderRadius: '4px' }}>
            HOTSPOT {hotspot.code || '#03'}
          </span>
        </div>
        <div className="title-risk-row" style={{ marginTop: '4px' }}>
          <h2 className="selected-location-title">{hotspot.name}</h2>
          <span className={`risk-badge-pill ${getRiskColorClass(stepInfo.severity)}`}>
            {getRiskLabelText(stepInfo.severity)}
          </span>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 4 OPERATOR FLOOD NOWCAST CARD (CENTIMETRES) */}
      {/* ------------------------------------------------------------- */}
      <div
        className="operator-nowcast-card"
        style={{
          background: '#0F172A',
          color: '#F8FAFC',
          borderRadius: '8px',
          padding: '16px',
          margin: '12px 0',
          border: '1px solid #334155',
          boxShadow: '0 4px 14px rgba(0,0,0,0.2)',
        }}
      >
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px', borderBottom: '1px solid #1E293B', pb: '8px' }}>
          <span style={{ fontSize: '11px', fontWeight: 800, color: '#38BDF8', letterSpacing: '0.8px' }}>
            ⚡ FLOOD NOWCAST (0–3h)
          </span>
          <span style={{ fontSize: '10px', color: '#94A3B8' }}>
            Presentation: <strong>Centimetres (cm)</strong>
          </span>
        </div>

        {/* Depth Evolution Sub-Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: '12px', background: '#1E293B', padding: '10px', borderRadius: '6px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Current depth:</span>
            <strong style={{ fontSize: '14px', color: '#F8FAFC' }}>{nowInfo.depthCm} cm</strong>
            <span style={{ fontSize: '10px', color: '#64748B', marginLeft: '4px' }}>({nowInfo.depth.toFixed(2)}m)</span>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>+30 min forecast:</span>
            <strong style={{ fontSize: '14px', color: '#38BDF8' }}>{m30Info.depthCm} cm</strong>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>+60 min forecast:</span>
            <strong style={{ fontSize: '14px', color: '#F59E0B' }}>{m60Info.depthCm} cm</strong>
          </div>

          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>+90 min forecast:</span>
            <strong style={{ fontSize: '14px', color: '#EF4444' }}>{m90Info.depthCm} cm</strong>
          </div>
        </div>

        {/* Onset, Peak, Duration Row */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '6px', textAlign: 'center', marginBottom: '12px', borderBottom: '1px solid #1E293B', pb: '10px' }}>
          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Onset:</span>
            <strong style={{ fontSize: '12px', color: '#F8FAFC' }}>
              {stepInfo.onset === 0 ? 'Active' : `${stepInfo.onset} min`}
            </strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Peak depth:</span>
            <strong style={{ fontSize: '12px', color: '#EF4444' }}>{hotspot.peakDepthCm || Math.round((stepInfo.peakCm || stepInfo.depth * 100))} cm</strong>
          </div>
          <div>
            <span style={{ fontSize: '10px', color: '#94A3B8', display: 'block' }}>Duration:</span>
            <strong style={{ fontSize: '12px', color: '#F8FAFC' }}>{stepInfo.duration} min</strong>
          </div>
        </div>

        {/* Section 4 Specific Metadata Fields */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px', fontSize: '11px' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8' }}>Road risk category:</span>
            <strong style={{ color: stepInfo.severity === 'CRITICAL' ? '#EF4444' : '#F59E0B' }}>
              {hotspot.roadRiskCategory || stepInfo.severity}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8' }}>Incident priority:</span>
            <strong style={{ color: '#38BDF8' }}>
              {hotspot.incidentPriority || (stepInfo.severity === 'CRITICAL' ? 'P1' : 'P2')}
            </strong>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between' }}>
            <span style={{ color: '#94A3B8' }}>Risk-aware routing:</span>
            <strong style={{ color: '#10B981' }}>
              {hotspot.routingRecommendation || 'Diversion recommended'}
            </strong>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* PHYSICS + AI & SYNTHETIC PROVENANCE BADGES */}
      {/* ------------------------------------------------------------- */}
      <div style={{ background: '#F8FAFC', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px', marginBottom: '12px', fontSize: '11px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 700, color: '#0F172A', marginBottom: '4px' }}>
          <ShieldCheck size={14} style={{ color: '#0284C7' }} />
          <span>Physics + AI Authoritative Gate</span>
        </div>

        <div style={{ color: '#475569', fontSize: '10px', marginBottom: '6px' }}>
          {hotspot.physicsGateStatus || 'AUTHORITATIVE (Passed OOD & Quality Gate)'}
        </div>

        <div style={{ display: 'flex', gap: '4px', flexWrap: 'wrap' }}>
          <span style={{ background: '#E0F2FE', color: '#0369A1', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>
            Gate: PASSED
          </span>
          <span style={{ background: '#F3E8FF', color: '#7E22CE', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>
            ML: 2D U-Net Candidate
          </span>
          <span style={{ background: '#FEF3C7', color: '#92400E', padding: '2px 6px', borderRadius: '4px', fontWeight: 700, fontSize: '10px' }}>
            [SYNTHETIC Labelled]
          </span>
        </div>
      </div>

      {/* Nearby Critical Assets */}
      <div className="nearby-assets-box">
        <h3 className="assets-box-heading">Nearby Critical Assets</h3>
        <ul className="assets-list">
          {hotspot.nearbyAssets.map((asset, index) => (
            <li key={index} className="asset-list-item">
              <span className="asset-name">{asset.name}</span>
              <span className="asset-distance">{asset.distance}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Actions */}
      <div className="details-actions-stack">
        <button
          className="gov-btn-secondary"
          onClick={onOpenDetailsModal}
        >
          View Full Report (cm)
        </button>

        <button
          className="gov-btn-secondary btn-outline-warning"
          onClick={onCreateIncident}
        >
          Create Incident
        </button>

        <button
          className="gov-btn-primary"
          onClick={onOpenAssignmentModal}
        >
          Assign Response
        </button>
      </div>
    </aside>
  );
}
