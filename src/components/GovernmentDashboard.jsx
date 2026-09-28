import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import SummaryBar from './SummaryBar';
import PriorityHotspots from './PriorityHotspots';
import HotspotDetails from './HotspotDetails';
import ForecastTimeline from './ForecastTimeline';
import AssignmentModal from './AssignmentModal';
import HotspotDetailsModal from './HotspotDetailsModal';
import GovernmentIncidentsView from './GovernmentIncidentsView';
import GovernmentAssetsView from './GovernmentAssetsView';
import GovernmentMapView from './GovernmentMapView';
import WorkflowPipelineView from './WorkflowPipelineView';
import Toast from './Toast';
import Footer from './Footer';
import { Map, Zap, Layers, Compass, Building, Users, ShieldAlert, Cpu } from 'lucide-react';

export default function GovernmentDashboard({ activeNav = 'dashboard', setActiveNav }) {
  const {
    hotspots,
    incidents,
    setSelectedIncident,
    updateIncidentStatus,
    currentStepId,
    setForecastStep,
    selectedHotspot,
    selectHotspot,
    createIncident,
    activeModal,
    setActiveModal,
    toastMessage,
    setToastMessage,
  } = useApp();

  const [activeStakeholder, setActiveStakeholder] = useState('control_room');

  // Sequential sorting for dashboard live feed
  const sortedIncidents = [...incidents].sort((a, b) => {
    const numA = parseInt((a.id || '').replace(/\D/g, ''), 10) || 0;
    const numB = parseInt((b.id || '').replace(/\D/g, ''), 10) || 0;
    return numB - numA;
  });

  return (
    <div className="gov-page-root">
      {/* Global Header */}
      <GlobalHeader activeNav={activeNav} setActiveNav={setActiveNav} />

      {/* Main Container */}
      <main className="gov-dashboard-main" id="main-content">
        {activeNav === 'workflow' ? (
          <WorkflowPipelineView />
        ) : activeNav === 'incidents' ? (
          <GovernmentIncidentsView />
        ) : activeNav === 'assets' ? (
          <GovernmentAssetsView />
        ) : activeNav === 'map' ? (
          <GovernmentMapView />
        ) : (
          <>
            {/* Page Header */}
            <div className="gov-page-header">
              <div className="page-header-title-area">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0284C7', color: '#FFFFFF', padding: '2px 8px', borderRadius: '4px', fontSize: '10px', fontWeight: 800, textTransform: 'uppercase', marginBottom: '4px' }}>
                  <Zap size={12} /> Physics-First 1D/2D Intelligence
                </div>
                <h1 className="gov-page-title">Urban Flood Nowcasting + Response Intelligence</h1>
                <p className="gov-page-description">
                  Don’t just show where water is. Predict how flooding evolves over 0–3 hours, understand why it happens, and turn predictions into street-level road risk, hotspots, and risk-aware routing.
                </p>
              </div>
              <div className="page-header-meta" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                <button
                  className="gov-btn-primary"
                  onClick={() => setActiveNav('workflow')}
                  style={{ padding: '6px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', background: '#0F172A' }}
                >
                  <Cpu size={15} /> 12-Step Architecture
                </button>
                <button
                  className="gov-btn-primary"
                  onClick={() => setActiveNav('map')}
                  style={{ padding: '6px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                >
                  <Map size={15} /> Open GIS Flood Map
                </button>
                <span className="status-online-dot">● Physics Engine Live</span>
              </div>
            </div>

            {/* Stakeholder Output View Selector Bar (Section 9) */}
            <div style={{ background: '#FFFFFF', border: '1px solid #E2E8F0', borderRadius: '6px', padding: '10px 14px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span style={{ fontSize: '12px', fontWeight: 800, color: '#0F172A', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                  Stakeholder Output Perspective:
                </span>
              </div>

              <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
                <button
                  onClick={() => setActiveStakeholder('control_room')}
                  style={{
                    background: activeStakeholder === 'control_room' ? '#0F172A' : '#F8FAFC',
                    color: activeStakeholder === 'control_room' ? '#FFFFFF' : '#334155',
                    border: activeStakeholder === 'control_room' ? '1px solid #0284C7' : '1px solid #CBD5E1',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  🏛️ Control Room
                </button>

                <button
                  onClick={() => setActiveStakeholder('responders')}
                  style={{
                    background: activeStakeholder === 'responders' ? '#0F172A' : '#F8FAFC',
                    color: activeStakeholder === 'responders' ? '#FFFFFF' : '#334155',
                    border: activeStakeholder === 'responders' ? '1px solid #0284C7' : '1px solid #CBD5E1',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  🚒 Emergency Responders
                </button>

                <button
                  onClick={() => setActiveStakeholder('citizens')}
                  style={{
                    background: activeStakeholder === 'citizens' ? '#0F172A' : '#F8FAFC',
                    color: activeStakeholder === 'citizens' ? '#FFFFFF' : '#334155',
                    border: activeStakeholder === 'citizens' ? '1px solid #0284C7' : '1px solid #CBD5E1',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  👥 Citizens
                </button>

                <button
                  onClick={() => setActiveStakeholder('planners')}
                  style={{
                    background: activeStakeholder === 'planners' ? '#0F172A' : '#F8FAFC',
                    color: activeStakeholder === 'planners' ? '#FFFFFF' : '#334155',
                    border: activeStakeholder === 'planners' ? '1px solid #0284C7' : '1px solid #CBD5E1',
                    padding: '5px 12px',
                    borderRadius: '4px',
                    fontSize: '12px',
                    fontWeight: 700,
                    cursor: 'pointer',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '5px',
                  }}
                >
                  🏙️ City Planners
                </button>
              </div>
            </div>

            {/* Stakeholder Output Description Banner */}
            {activeStakeholder === 'responders' && (
              <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#1E40AF' }}>
                <strong>Emergency Responder Output View:</strong> Displaying street-level road risk categories (SAFE, CAUTION, HIGH_RISK, CRITICAL), forecast onset/depth (cm), and risk-aware safe corridor bypass routes.
              </div>
            )}
            {activeStakeholder === 'citizens' && (
              <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#166534' }}>
                <strong>Citizen Output View:</strong> Displaying clear flood warnings, expected onset time (min), depth in centimetres (cm), affected roads &amp; risk-aware travel guidance.
              </div>
            )}
            {activeStakeholder === 'planners' && (
              <div style={{ background: '#F5F3FF', border: '1px solid #DDD6FE', padding: '10px 14px', borderRadius: '6px', marginBottom: '16px', fontSize: '12px', color: '#5B21B6' }}>
                <strong>City Planner Output View:</strong> Displaying recurring hotspots, 1D SWMM drainage bottlenecks, culvert capacity limits, and infrastructure planning evidence.
              </div>
            )}

            {/* Escalation Alert Banner */}
            {incidents.some((i) => i.status === 'ESCALATED') && (
              <div style={{ background: '#BE123C', color: '#FFFFFF', padding: '12px 18px', borderRadius: '6px', marginBottom: '16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', boxShadow: '0 4px 12px rgba(190, 18, 60, 0.25)' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                  <span style={{ fontSize: '20px' }}>🚨</span>
                  <div>
                    <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800 }}>STATE EMERGENCY COMMAND ALERT: Escalated Incidents Active</h3>
                    <p style={{ margin: '2px 0 0 0', fontSize: '12px', opacity: 0.9 }}>
                      {incidents.filter((i) => i.status === 'ESCALATED').length} flood incident(s) escalated to NDRF Battalion 4 &amp; State Emergency Control.
                    </p>
                  </div>
                </div>
                <button
                  className="gov-btn-secondary"
                  onClick={() => setActiveNav('incidents')}
                  style={{ background: '#FFFFFF', color: '#BE123C', borderColor: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '6px 12px' }}
                >
                  View Escalated Incidents →
                </button>
              </div>
            )}

            {/* Summary Statistics Horizontal Bar */}
            <SummaryBar hotspotsData={hotspots} currentStepId={currentStepId} />

            {/* Main 2-Column Dashboard Layout */}
            <div className="gov-dashboard-grid-no-map">
              {/* Left Column — Priority Hotspots */}
              <PriorityHotspots
                hotspotsData={hotspots}
                selectedHotspot={selectedHotspot}
                onSelectHotspot={(item) => selectHotspot(item.id)}
                currentStepId={currentStepId}
              />

              {/* Right Column — Selected Location Details & Operator Card */}
              <HotspotDetails
                hotspot={selectedHotspot}
                currentStepId={currentStepId}
                onOpenDetailsModal={() => setActiveNav('hotspots')}
                onCreateIncident={() => createIncident(selectedHotspot)}
                onOpenAssignmentModal={() => setActiveModal('assign')}
              />
            </div>

            {/* Live Citizen & Emergency Reports Feed */}
            <div className="gov-card" style={{ marginTop: '20px', padding: '16px', background: '#FFFFFF', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                <div>
                  <h3 style={{ fontSize: '16px', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>
                    Live Reported Flood Incidents &amp; Field Stream ({incidents.length})
                  </h3>
                  <p style={{ fontSize: '12px', color: 'var(--text-muted)', margin: '2px 0 0 0' }}>
                    Citizen reports act as validation evidence to verify physics predictions.
                  </p>
                </div>
                <button
                  className="gov-btn-secondary"
                  onClick={() => setActiveNav('incidents')}
                  style={{ fontSize: '12px', padding: '4px 10px' }}
                >
                  View All Incidents →
                </button>
              </div>

              <div className="gov-table-container" style={{ overflowX: 'auto' }}>
                <table className="gov-ops-table" style={{ width: '100%', fontSize: '13px' }}>
                  <thead>
                    <tr>
                      <th>Seq #</th>
                      <th>Incident ID</th>
                      <th>Location</th>
                      <th>Severity</th>
                      <th>Source</th>
                      <th>Report Time</th>
                      <th>Resolution Status</th>
                      <th>Assigned Team</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sortedIncidents.slice(0, 5).map((inc, idx) => (
                      <tr key={inc.id} style={{ backgroundColor: inc.source.includes('Citizen') ? '#F0F9FF' : 'transparent' }}>
                        <td className="font-mono text-muted" style={{ fontWeight: 700 }}>#{idx + 1}</td>
                        <td className="font-mono" style={{ fontWeight: 700, color: 'var(--blue-primary)' }}>
                          #{inc.id}
                          {inc.source.includes('Citizen') && (
                            <span className="status-tag tag-reported" style={{ marginLeft: '6px', fontSize: '10px' }}>
                              Citizen Evidence
                            </span>
                          )}
                        </td>
                        <td className="font-medium">{inc.location}</td>
                        <td>
                          <span className={`risk-badge-text ${inc.severity === 'CRITICAL' ? 'text-critical' : inc.severity === 'HIGH' ? 'text-high' : 'text-moderate'}`}>
                            ● {inc.severity}
                          </span>
                        </td>
                        <td>{inc.source}</td>
                        <td>{inc.time}</td>
                        <td>
                          <select
                            className="gov-status-select-dropdown"
                            value={inc.status}
                            onChange={(e) => updateIncidentStatus(inc.id, e.target.value)}
                            style={{
                              padding: '3px 6px',
                              borderRadius: '4px',
                              fontSize: '11px',
                              fontWeight: '700',
                              border: '1px solid #CBD5E1',
                              cursor: 'pointer',
                              backgroundColor:
                                inc.status === 'RESOLVED'
                                  ? '#E0F2FE'
                                  : inc.status === 'ASSIGNED' || inc.status === 'IN_PROGRESS'
                                  ? '#FEF3C7'
                                  : inc.status === 'VALIDATED'
                                  ? '#DCFCE7'
                                  : inc.status === 'REJECTED'
                                  ? '#FEE2E2'
                                  : '#F1F5F9',
                              color:
                                inc.status === 'RESOLVED'
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
                            <option value="RESOLVED">● RESOLVED</option>
                            <option value="REJECTED">● REJECTED</option>
                          </select>
                        </td>
                        <td>{inc.assignedTeam || '—'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* Bottom Section — Flood Forecast Next 3 Hours */}
            <ForecastTimeline
              currentStepId={currentStepId}
              setCurrentStepId={setForecastStep}
              selectedHotspot={selectedHotspot}
            />
          </>
        )}
      </main>

      {/* Modals & Triggers */}
      <AssignmentModal
        hotspot={selectedHotspot}
        isOpen={activeModal === 'assign'}
        onClose={() => setActiveModal(null)}
      />

      <HotspotDetailsModal
        hotspot={selectedHotspot}
        isOpen={activeModal === 'details'}
        onClose={() => setActiveModal(null)}
      />

      <Toast message={toastMessage} onClose={() => setToastMessage(null)} />

      {/* Footer */}
      <Footer />
    </div>
  );
}
