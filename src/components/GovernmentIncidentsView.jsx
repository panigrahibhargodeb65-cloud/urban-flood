import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import IncidentDrawer from './IncidentDrawer';
import { Sparkles, Bot } from 'lucide-react';

export default function GovernmentIncidentsView() {
  const { incidents, setSelectedIncident, selectedIncident, updateIncidentStatus } = useApp();
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const openCount = incidents.filter((i) => i.status !== 'RESOLVED' && i.status !== 'REJECTED').length;
  const criticalCount = incidents.filter((i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length;
  const highCount = incidents.filter((i) => i.severity === 'HIGH' && i.status !== 'RESOLVED').length;

  // Strict Sequential Sorting by Numerical ID (Newest sequential # at top)
  const sortedIncidents = [...incidents].sort((a, b) => {
    const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
    const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
    return numB - numA;
  });

  const filteredIncidents = sortedIncidents.filter((inc) => {
    if (filterSeverity === 'ALL') return true;
    return inc.severity === filterSeverity;
  });

  const getSeverityBadge = (severity, status) => {
    if (status === 'ESCALATED') {
      return (
        <span className="risk-badge-text" style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FDA4AF', padding: '3px 8px', borderRadius: '12px', fontWeight: 800 }}>
          🚨 ESCALATED
        </span>
      );
    }
    switch (severity) {
      case 'CRITICAL':
        return <span className="risk-badge-text text-critical">● CRITICAL</span>;
      case 'HIGH':
        return <span className="risk-badge-text text-high">● HIGH</span>;
      case 'MODERATE':
        return <span className="risk-badge-text text-moderate">● MODERATE</span>;
      default:
        return <span className="risk-badge-text text-safe">● SAFE</span>;
    }
  };

  return (
    <div className="gov-incidents-view">
      {/* Page Header */}
      <div className="gov-page-header">
        <div className="page-header-title-area">
          <h1 className="gov-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Municipal Flood Incidents &amp; Citizen Reports
            <span className="ai-status-tag">
              <Sparkles size={13} /> AI Incident Assist Active
            </span>
          </h1>
          <p className="gov-page-description">
            Monitor active flood incidents, citizen field reports, verification status, and AI response dispatches sequentially.
          </p>
        </div>
        <div className="page-header-meta">
          <span className="last-updated-text">Active Open Incidents: <strong>{openCount}</strong></span>
        </div>
      </div>

      {/* Summary Statistics Strip */}
      <div className="gov-summary-strip">
        <div className="summary-item">
          <span className="summary-number">{incidents.length}</span>
          <span className="summary-label">Total Logged</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-item risk-critical-text">
          <span className="summary-number">{criticalCount}</span>
          <span className="summary-label">● Critical Severity</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-item risk-high-text">
          <span className="summary-number">{highCount}</span>
          <span className="summary-label">● High Severity</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-item text-blue">
          <span className="summary-number">{openCount}</span>
          <span className="summary-label">Open / Active</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-table-filter-bar">
        <span className="filter-title">Filter Severity:</span>
        {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((sev) => (
          <button
            key={sev}
            className={`gov-filter-btn ${filterSeverity === sev ? 'active' : ''}`}
            onClick={() => setFilterSeverity(sev)}
          >
            {sev === 'ALL' ? 'All Severities' : sev}
          </button>
        ))}
      </div>

      {/* Incidents Table */}
      <div className="gov-table-container">
        <table className="gov-ops-table">
          <thead>
            <tr>
              <th>Seq #</th>
              <th>Incident ID</th>
              <th>Location</th>
              <th>Severity</th>
              <th>Source</th>
              <th>Log Time</th>
              <th>Update Status</th>
              <th>Assigned Team</th>
              <th style={{ textAlign: 'right' }}>Actions &amp; AI Assist</th>
            </tr>
          </thead>
          <tbody>
            {filteredIncidents.map((inc, index) => (
              <tr key={inc.id} style={{ backgroundColor: inc.status === 'ESCALATED' ? '#FFF1F2' : inc.source.includes('Citizen') ? '#F0F9FF' : 'transparent' }}>
                <td className="font-mono text-muted" style={{ fontWeight: 700 }}>#{index + 1}</td>
                <td className="font-mono" style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                  #{inc.id}
                  {inc.source.includes('Citizen') && (
                    <span className="status-tag tag-reported" style={{ marginLeft: '6px', fontSize: '10px' }}>
                      Citizen Report
                    </span>
                  )}
                </td>
                <td className="font-medium">{inc.location}</td>
                <td>{getSeverityBadge(inc.severity, inc.status)}</td>
                <td>{inc.source}</td>
                <td>{inc.time}</td>
                <td>
                  <select
                    className="gov-status-select-dropdown"
                    value={inc.status}
                    onChange={(e) => updateIncidentStatus(inc.id, e.target.value)}
                    title="Update problem status"
                    style={{
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px',
                      fontWeight: '700',
                      border: '1px solid #CBD5E1',
                      cursor: 'pointer',
                      backgroundColor:
                        inc.status === 'ESCALATED'
                          ? '#FFF1F2'
                          : inc.status === 'RESOLVED'
                          ? '#E0F2FE'
                          : inc.status === 'ASSIGNED' || inc.status === 'IN_PROGRESS'
                          ? '#FEF3C7'
                          : inc.status === 'VALIDATED'
                          ? '#DCFCE7'
                          : inc.status === 'REJECTED'
                          ? '#FEE2E2'
                          : '#F1F5F9',
                      color:
                        inc.status === 'ESCALATED'
                          ? '#BE123C'
                          : inc.status === 'RESOLVED'
                          ? '#0284C7'
                          : inc.status === 'ASSIGNED' || inc.status === 'IN_PROGRESS'
                          ? '#B45309'
                          : inc.status === 'VALIDATED'
                          ? '#15803D'
                          : inc.status === 'REJECTED'
                          ? '#B91C1C'
                          : '#334155',
                    }}
                  >
                    <option value="REPORTED">● REPORTED</option>
                    <option value="VALIDATED">● VALIDATED</option>
                    <option value="ASSIGNED">● ASSIGNED</option>
                    <option value="IN_PROGRESS">● IN PROGRESS</option>
                    <option value="ESCALATED">🚨 ESCALATED</option>
                    <option value="RESOLVED">● RESOLVED</option>
                    <option value="REJECTED">● REJECTED</option>
                  </select>
                </td>
                <td>{inc.assignedTeam || '—'}</td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className="gov-btn-table-action"
                    onClick={() => setSelectedIncident(inc)}
                    style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                  >
                    <Sparkles size={12} />
                    Review &amp; AI Assist
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Incident Review Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
      />
    </div>
  );
}
