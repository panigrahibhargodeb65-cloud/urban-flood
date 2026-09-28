import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import IncidentDrawer from './IncidentDrawer';
import GovernmentMapView from './GovernmentMapView';
import GovernmentIncidentsView from './GovernmentIncidentsView';
import GovernmentAssetsView from './GovernmentAssetsView';
import HotspotDetailsPage from './HotspotDetailsPage';
import WorkflowPipelineView from './WorkflowPipelineView';
import Footer from './Footer';
import { Sparkles, Plus, Trash2 } from 'lucide-react';

export default function AdminOperationsPage({ activeNav = 'operations', setActiveNav }) {
  const {
    incidents,
    hotspots,
    createIncident,
    deleteIncident,
    updateIncidentStatus,
    setSelectedIncident,
    selectedIncident,
  } = useApp();

  const [filterStatus, setFilterStatus] = useState('ALL');
  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [newLodgeLocation, setNewLodgeLocation] = useState('');
  const [newLodgeSeverity, setNewLodgeSeverity] = useState('HIGH');
  const [newLodgeNotes, setNewLodgeNotes] = useState('');

  useEffect(() => {
    if (activeNav === 'verification') {
      setFilterStatus('REPORTED');
    } else if (activeNav === 'incidents' || activeNav === 'operations') {
      setFilterStatus('ALL');
    }
  }, [activeNav]);

  // Dynamic calculation of summary metrics
  const openCount = incidents.filter((i) => i.status !== 'RESOLVED' && i.status !== 'REJECTED').length;
  const criticalCount = incidents.filter((i) => (i.severity === 'CRITICAL' || i.status === 'ESCALATED') && i.status !== 'RESOLVED').length;
  const awaitingVerifCount = incidents.filter((i) => i.status === 'REPORTED').length;
  const inProgressCount = incidents.filter((i) => i.status === 'IN_PROGRESS' || i.status === 'ASSIGNED').length;
  const resolvedCount = incidents.filter((i) => i.status === 'RESOLVED').length;
  const escalatedCount = incidents.filter((i) => i.status === 'ESCALATED' || i.isEscalated).length;

  // Strict Sequential Sorting by Numerical ID (Newest sequential # at top)
  const sortedIncidents = [...incidents].sort((a, b) => {
    const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
    const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
    return numB - numA;
  });

  const filteredIncidents = sortedIncidents.filter((inc) => {
    if (filterStatus === 'ALL') return true;
    if (filterStatus === 'ESCALATED') return inc.status === 'ESCALATED' || inc.isEscalated;
    return inc.status === filterStatus;
  });

  const handleLodgeSubmit = (e) => {
    e.preventDefault();
    const loc = newLodgeLocation.trim() || 'Khetrajpur Station Road Junction';
    createIncident({
      location: loc,
      name: loc,
      severity: newLodgeSeverity,
      notes: newLodgeNotes || `Emergency incident lodged for ${loc}.`,
    });
    setNewLodgeLocation('');
    setNewLodgeNotes('');
    setShowLodgeModal(false);
  };

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
    <div className="gov-page-root">
      <GlobalHeader activeNav={activeNav} setActiveNav={setActiveNav} />

      <main className="gov-ops-page-main" id="main-content">
        {activeNav === 'workflow' ? (
          <WorkflowPipelineView />
        ) : activeNav === 'map' ? (
          <GovernmentMapView />
        ) : activeNav === 'incidents' ? (
          <GovernmentIncidentsView />
        ) : activeNav === 'assets' ? (
          <GovernmentAssetsView />
        ) : activeNav === 'hotspots' ? (
          <HotspotDetailsPage setActiveNav={setActiveNav} onBackToDashboard={() => setActiveNav('operations')} />
        ) : (
          <>
        {/* Page Title & Subtitle */}
        <div className="gov-page-header">
          <div className="page-header-title-area">
            <h1 className="gov-page-title">Super-Administrator Operations Portal</h1>
            <p className="gov-page-description">
              Full control room privileges: review citizen &amp; sensor reports, lodge emergency incidents, update statuses, and purge invalid entries.
            </p>
          </div>
          <div className="page-header-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              className="gov-btn-primary"
              onClick={() => setShowLodgeModal(true)}
              style={{ fontSize: '13px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
            >
              <Plus size={15} /> Lodge Emergency Incident
            </button>
            <span className="last-updated-text">Admin Master Access • Active</span>
          </div>
        </div>

        {/* Dynamic Summary Metrics Strip */}
        <div className="gov-summary-strip">
          <div className="summary-item">
            <span className="summary-number">{openCount}</span>
            <span className="summary-label">Open Incidents</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item risk-critical-text">
            <span className="summary-number">{criticalCount}</span>
            <span className="summary-label">Critical</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item risk-high-text">
            <span className="summary-number">{awaitingVerifCount}</span>
            <span className="summary-label">Awaiting Verification</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item text-blue">
            <span className="summary-number">{inProgressCount}</span>
            <span className="summary-label">In Progress / Assigned</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item text-safe">
            <span className="summary-number">{resolvedCount}</span>
            <span className="summary-label">Resolved</span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="gov-table-filter-bar" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <span className="filter-title">Filter by status:</span>
            {['ALL', 'REPORTED', 'VALIDATED', 'ASSIGNED', 'IN_PROGRESS', 'ESCALATED', 'RESOLVED', 'REJECTED'].map((st) => (
              <button
                key={st}
                className={`gov-filter-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
                style={st === 'ESCALATED' ? { borderColor: '#FCA5A5', color: '#BE123C' } : {}}
              >
                {st === 'ALL' ? 'All' : st === 'ESCALATED' ? '🚨 Escalated' : st.replace('_', ' ')}
              </button>
            ))}
          </div>

          <span style={{ fontSize: '12px', color: 'var(--text-muted)' }}>
            Showing <strong>{filteredIncidents.length}</strong> of {incidents.length} total entries
          </span>
        </div>

        {/* Operational Data Table */}
        <div className="gov-table-container">
          <table className="gov-ops-table">
            <thead>
              <tr>
                <th>Seq #</th>
                <th>Incident ID</th>
                <th>Location</th>
                <th>Severity</th>
                <th>Source</th>
                <th>Time</th>
                <th>Resolution Status</th>
                <th>Assigned Team</th>
                <th style={{ textAlign: 'right' }}>Actions &amp; Management</th>
              </tr>
            </thead>
            <tbody>
              {filteredIncidents.length === 0 ? (
                <tr>
                  <td colSpan="9" style={{ textAlign: 'center', padding: '30px', color: 'var(--text-muted)' }}>
                    No incidents found matching current status filter (<strong>{filterStatus}</strong>).
                    <div style={{ marginTop: '10px' }}>
                      <button className="gov-btn-secondary" onClick={() => setFilterStatus('ALL')}>
                        Clear Status Filters
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredIncidents.map((inc, index) => (
                  <tr key={inc.id} style={{ backgroundColor: inc.status === 'ESCALATED' ? '#FFF1F2' : inc.source.includes('Citizen') ? '#F0F9FF' : 'transparent' }}>
                    <td className="font-mono text-muted" style={{ fontWeight: 700 }}>#{index + 1}</td>
                    <td className="font-mono" style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                      #{inc.id}
                      {inc.source.includes('Citizen') && (
                        <span className="status-tag tag-reported" style={{ marginLeft: '6px', fontSize: '10px' }}>
                          Citizen
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
                        title="Update problem resolution status"
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
                        <option value="REPORTED">● REPORTED (Under Review)</option>
                        <option value="VALIDATED">● VALIDATED (Verified)</option>
                        <option value="ASSIGNED">● ASSIGNED (Team Dispatched)</option>
                        <option value="IN_PROGRESS">● IN PROGRESS (Action Active)</option>
                        <option value="ESCALATED">🚨 ESCALATED (State Command)</option>
                        <option value="RESOLVED">● RESOLVED (Closed)</option>
                        <option value="REJECTED">● REJECTED (Invalid)</option>
                      </select>
                    </td>
                    <td>{inc.assignedTeam || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                        <button
                          className="gov-btn-table-action"
                          onClick={() => setSelectedIncident(inc)}
                          style={{ display: 'inline-flex', alignItems: 'center', gap: '5px' }}
                        >
                          <Sparkles size={12} />
                          {inc.status === 'REPORTED' ? 'Review & AI Assist' : 'Manage & AI'}
                        </button>
                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to purge incident #${inc.id}?`)) {
                              deleteIncident(inc.id);
                            }
                          }}
                          title="Purge incident record"
                          style={{
                            border: '1px solid #FCA5A5',
                            background: '#FEF2F2',
                            color: '#B91C1C',
                            padding: '4px 6px',
                            borderRadius: '4px',
                            cursor: 'pointer',
                            display: 'inline-flex',
                            alignItems: 'center',
                          }}
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        </>
        )}
      </main>

      {/* Lodge Emergency Incident Modal for NEW places & custom locations */}
      {showLodgeModal && (
        <div className="gov-modal-backdrop" onClick={() => setShowLodgeModal(false)}>
          <div className="gov-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header-row">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Plus size={18} style={{ color: '#0284C7' }} /> Lodge Emergency Incident (Any Location)
              </h3>
              <button className="gov-modal-close" onClick={() => setShowLodgeModal(false)}>
                ✕
              </button>
            </div>

            <form onSubmit={handleLodgeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              <div className="form-field">
                <label className="gov-form-label">Location Name / New Place Point</label>
                <input
                  type="text"
                  className="gov-form-input"
                  placeholder="e.g. Sakhipara Main Market or Modipara Chowk"
                  value={newLodgeLocation}
                  onChange={(e) => setNewLodgeLocation(e.target.value)}
                  required
                />
                <span style={{ fontSize: '11px', color: '#64748B', marginTop: '4px' }}>
                  💡 Lodging a new location automatically generates a GIS Map Hotspot Pin on Leaflet Map!
                </span>
              </div>

              <div className="form-field">
                <label className="gov-form-label">Initial Severity</label>
                <select
                  className="gov-form-select"
                  value={newLodgeSeverity}
                  onChange={(e) => setNewLodgeSeverity(e.target.value)}
                >
                  <option value="CRITICAL">● CRITICAL (High Flood Depth / Substation)</option>
                  <option value="HIGH">● HIGH (Road Drainage Inundation)</option>
                  <option value="MODERATE">● MODERATE (Localized Surcharge)</option>
                  <option value="LOW">● LOW (Minor Accumulation)</option>
                </select>
              </div>

              <div className="form-field">
                <label className="gov-form-label">Incident Description / Notes</label>
                <textarea
                  className="gov-form-input"
                  rows="3"
                  placeholder="Describe flood conditions, culvert blockage, or emergency requirements..."
                  value={newLodgeNotes}
                  onChange={(e) => setNewLodgeNotes(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  className="gov-btn-secondary"
                  onClick={() => setShowLodgeModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary">
                  Lodge Incident &amp; Map to GIS →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Incident Review Drawer */}
      <IncidentDrawer
        incident={selectedIncident}
        isOpen={Boolean(selectedIncident)}
        onClose={() => setSelectedIncident(null)}
      />

      <Footer />
    </div>
  );
}
