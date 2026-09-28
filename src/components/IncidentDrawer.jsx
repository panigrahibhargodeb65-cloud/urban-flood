import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, ShieldCheck, Sparkles, Bot, Zap, Copy, Check } from 'lucide-react';

export default function IncidentDrawer({ incident, isOpen, onClose }) {
  const {
    auth,
    validateIncident,
    assignResponseTeam,
    applyAiRecommendation,
    updateIncidentStatus,
    deleteIncident,
    deployPumpAtNewPoint,
    escalateIncident,
    showToast,
  } = useApp();

  const [selectedTeam, setSelectedTeam] = useState('Municipal Task Force');
  const [selectedPriority, setSelectedPriority] = useState('Critical');
  const [copiedSitrep, setCopiedSitrep] = useState(false);
  const [showEscalationForm, setShowEscalationForm] = useState(false);
  const [escalationReason, setEscalationReason] = useState('Critical flood depth (>1.0m) & structural threat');

  if (!isOpen || !incident) return null;

  // AI Recommendation Logic based on flood telemetry & location
  const getAiAssistRecommendation = (inc) => {
    const loc = (inc.location || '').toLowerCase();
    const notes = (inc.notes || '').toLowerCase();
    const severity = inc.severity;

    if (severity === 'CRITICAL' || loc.includes('underpass') || loc.includes('station')) {
      return {
        team: 'NDRF Battalion 4',
        priority: 'CRITICAL',
        confidence: 96,
        reasoning: 'Critical water depth detected with threat to high-priority transport corridor & emergency routes.',
        action: 'Deploy heavy mobile dewatering pumps & establish traffic diversion corridor.',
      };
    } else if (loc.includes('market') || notes.includes('traffic')) {
      return {
        team: 'Traffic Police',
        priority: 'HIGH',
        confidence: 91,
        reasoning: 'High surface accumulation causing congestion in commercial district.',
        action: 'Reroute market traffic to secondary boulevard & deploy drainage suction truck.',
      };
    } else {
      return {
        team: 'Municipal Task Force',
        priority: severity || 'HIGH',
        confidence: 89,
        reasoning: 'Drainage surcharge reported. Culvert clearing and localized pump unit recommended.',
        action: 'Dispatch municipal maintenance crew & clear storm drain debris.',
      };
    }
  };

  const aiRec = getAiAssistRecommendation(incident);

  const handleVerify = () => {
    validateIncident(incident.id);
  };

  const handleAssignSubmit = (e) => {
    e.preventDefault();
    assignResponseTeam(incident.id, selectedTeam, selectedPriority);
  };

  const handleApplyAiAssist = () => {
    applyAiRecommendation(incident.id, aiRec.team, aiRec.priority);
  };

  const generateSitRepText = () => {
    return `[SIH AI ASSIST SITREP]
Incident ID: #${incident.id}
Location: ${incident.location}
Severity: ${incident.severity}
Status: ${incident.status}
Recommended Team: ${aiRec.team} (${aiRec.priority} Priority)
Action: ${aiRec.action}
Confidence: ${aiRec.confidence}%`;
  };

  const handleCopySitrep = () => {
    const text = generateSitRepText();
    navigator.clipboard.writeText(text).then(() => {
      setCopiedSitrep(true);
      if (showToast) showToast('AI SitRep copied to clipboard!');
      setTimeout(() => setCopiedSitrep(false), 2500);
    });
  };

  return (
    <div className="gov-drawer-backdrop" onClick={onClose}>
      <div className="gov-drawer-container" onClick={(e) => e.stopPropagation()}>
        {/* Drawer Header */}
        <div className="drawer-header-row">
          <div>
            <span className="drawer-sub-label">Incident Review #{incident.id}</span>
            <h2 className="drawer-location-title">{incident.location}</h2>
          </div>
          <button className="gov-drawer-close-btn" onClick={onClose} aria-label="Close Drawer">
            <X size={18} />
          </button>
        </div>

        <div className="drawer-scroll-body">
          {/* AI Incident Assist Card */}
          <div className="ai-assist-drawer-box">
            <div className="ai-assist-box-header">
              <div className="ai-assist-title-group">
                <Sparkles size={18} className="ai-sparkle-icon" />
                <span className="ai-assist-title">AI Incident Assist</span>
              </div>
              <span className="ai-confidence-pill">AI Confidence: {aiRec.confidence}%</span>
            </div>

            <p className="ai-assist-reasoning">{aiRec.reasoning}</p>

            <div className="ai-recommendation-card">
              <div className="ai-rec-row">
                <span className="ai-rec-label">Recommended Team:</span>
                <span className="ai-rec-team">{aiRec.team}</span>
              </div>
              <div className="ai-rec-row">
                <span className="ai-rec-label">Suggested Priority:</span>
                <span className={`ai-rec-priority priority-${aiRec.priority.toLowerCase()}`}>
                  ● {aiRec.priority}
                </span>
              </div>
              <div className="ai-rec-row">
                <span className="ai-rec-label">Action Plan:</span>
                <span className="ai-rec-action">{aiRec.action}</span>
              </div>
            </div>

            {incident.status !== 'RESOLVED' && incident.assignedTeam !== aiRec.team && (
              <button className="ai-apply-btn" onClick={handleApplyAiAssist}>
                <Zap size={14} />
                <span>1-Click AI Auto-Dispatch</span>
              </button>
            )}

            <div className="ai-sitrep-row">
              <button className="ai-sitrep-btn" onClick={handleCopySitrep}>
                {copiedSitrep ? <Check size={14} /> : <Copy size={14} />}
                <span>{copiedSitrep ? 'SitRep Copied!' : 'Copy Field SitRep'}</span>
              </button>
            </div>
          </div>

          {/* Incident Details Section */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Incident Details</h3>
            <div className="drawer-detail-grid">
              <div className="detail-item">
                <span className="d-label">Location:</span>
                <span className="d-val">{incident.location}</span>
              </div>
              <div className="detail-item">
                <span className="d-label">Log Time:</span>
                <span className="d-val">{incident.time}</span>
              </div>
              <div className="detail-item">
                <span className="d-label">Severity:</span>
                <span className="d-val font-semibold">{incident.severity}</span>
              </div>
              <div className="detail-item">
                <span className="d-label">Current Status:</span>
                <span className="d-val text-blue font-semibold">{incident.status.replace('_', ' ')}</span>
              </div>
            </div>
          </div>

          {/* Citizen Report Section */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Citizen Report Data</h3>
            <div className="drawer-detail-grid">
              <div className="detail-item">
                <span className="d-label">Reported depth:</span>
                <span className="d-val font-semibold">0.7–1.0 m</span>
              </div>
              <div className="detail-item">
                <span className="d-label">Category:</span>
                <span className="d-val">Road Flooding &amp; Drainage Surcharge</span>
              </div>
              <div className="detail-item full-width">
                <span className="d-label">Description:</span>
                <span className="d-val">{incident.notes || 'Water accumulating rapidly; road unpassable.'}</span>
              </div>
            </div>

            {incident.photo && (
              <div className="drawer-photo-box">
                <span className="d-label">Field Photo:</span>
                <img src={incident.photo} alt="Citizen report evidence" className="citizen-photo" />
              </div>
            )}
          </div>

          {/* Model Prediction Section */}
          <div className="drawer-section">
            <h3 className="drawer-section-title">Model Prediction</h3>
            <div className="drawer-detail-grid">
              <div className="detail-item">
                <span className="d-label">Predicted depth:</span>
                <span className="d-val font-semibold">0.82 m</span>
              </div>
              <div className="detail-item">
                <span className="d-label">Prediction confidence:</span>
                <span className="d-val">91%</span>
              </div>
            </div>
          </div>

          {/* Important Validation Note */}
          <div className="gov-important-alert">
            <ShieldCheck size={16} className="text-blue" />
            <span>"Citizen report used as validation evidence."</span>
          </div>

          {/* Universal Status Management Box */}
          <div className="drawer-section workflow-actions-box" style={{ background: '#F8FAFC', padding: '14px', borderRadius: '6px', border: '1px solid #E2E8F0', marginTop: '14px' }}>
            <h3 className="drawer-section-title" style={{ color: 'var(--text-primary)', marginBottom: '8px' }}>Update Resolution Status</h3>
            <div className="status-button-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
              <button
                className={`gov-btn-secondary ${incident.status === 'VALIDATED' ? 'active' : ''}`}
                onClick={() => updateIncidentStatus(incident.id, 'VALIDATED')}
                style={{ fontSize: '12px', padding: '6px' }}
              >
                Mark Validated
              </button>

              <button
                className={`gov-btn-secondary ${incident.status === 'IN_PROGRESS' ? 'active' : ''}`}
                onClick={() => updateIncidentStatus(incident.id, 'IN_PROGRESS')}
                style={{ fontSize: '12px', padding: '6px' }}
              >
                Mark In Progress
              </button>

              <button
                className={`gov-btn-primary ${incident.status === 'RESOLVED' ? 'active' : ''}`}
                onClick={() => {
                  updateIncidentStatus(incident.id, 'RESOLVED');
                }}
                style={{ fontSize: '12px', padding: '6px', gridColumn: 'span 2' }}
              >
                ✓ Mark Resolved &amp; Close Issue
              </button>

              {incident.status !== 'REJECTED' && (
                <button
                  className="gov-btn-secondary"
                  onClick={() => updateIncidentStatus(incident.id, 'REJECTED')}
                  style={{ fontSize: '11px', padding: '4px', color: '#B91C1C', gridColumn: 'span 2' }}
                >
                  Reject Report
                </button>
              )}
            </div>
          </div>

          {/* High Priority Problem Escalation Box */}
          <div className="drawer-section escalation-control-box" style={{ background: '#FFF1F2', padding: '14px', borderRadius: '6px', border: '1px solid #FECDD3', marginTop: '14px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '8px' }}>
              <h3 className="drawer-section-title" style={{ color: '#BE123C', margin: 0, display: 'flex', alignItems: 'center', gap: '6px' }}>
                🚨 Problem Escalation Center
              </h3>
              {incident.status === 'ESCALATED' && (
                <span style={{ background: '#BE123C', color: '#FFFFFF', padding: '2px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 700 }}>
                  ESCALATED TO STATE
                </span>
              )}
            </div>

            {incident.status === 'ESCALATED' ? (
              <div style={{ fontSize: '12px', color: '#9F1239', background: '#FFE4E6', padding: '10px', borderRadius: '4px', borderLeft: '4px solid #BE123C' }}>
                <strong>🚨 STATE EMERGENCY ALERT ACTIVE:</strong>
                <p style={{ margin: '4px 0 0 0' }}>This incident has been escalated to <strong>NDRF Battalion 4 &amp; State Response Command</strong>.</p>
                <p style={{ margin: '4px 0 0 0', fontSize: '11px', color: '#881337' }}>Reason: {incident.escalationReason || 'Critical inundation threat'}</p>
              </div>
            ) : (
              <div>
                <p style={{ fontSize: '12px', color: '#881337', marginBottom: '10px', lineHeight: '1.4' }}>
                  Escalate severe or unhandled flood emergencies directly to State Disaster Management &amp; NDRF Dispatch.
                </p>
                
                {!showEscalationForm ? (
                  <button
                    className="gov-btn-primary full-width"
                    onClick={() => setShowEscalationForm(true)}
                    style={{ background: '#BE123C', borderColor: '#9F1239', color: '#FFFFFF', fontWeight: 700, fontSize: '12px', padding: '8px' }}
                  >
                    🚨 Escalate to NDRF &amp; State Command
                  </button>
                ) : (
                  <div style={{ background: '#FFFFFF', padding: '10px', borderRadius: '4px', border: '1px solid #FDA4AF' }}>
                    <label className="gov-form-label" style={{ color: '#9F1239', fontSize: '11px' }}>Select Escalation Reason:</label>
                    <select
                      className="gov-form-select"
                      value={escalationReason}
                      onChange={(e) => setEscalationReason(e.target.value)}
                      style={{ marginBottom: '10px', fontSize: '12px' }}
                    >
                      <option value="Critical flood depth (>1.0m) & structural threat">Critical flood depth (&gt;1.0m) &amp; structural threat</option>
                      <option value="Power Substation Inundation / Public Infrastructure Threat">Power Substation Inundation / Public Infrastructure Threat</option>
                      <option value="Rapid Water Rise - Immediate Evacuation Required">Rapid Water Rise - Immediate Evacuation Required</option>
                      <option value="High Priority Road Corridor Fully Blocked">High Priority Road Corridor Fully Blocked</option>
                    </select>

                    <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        type="button"
                        className="gov-btn-secondary"
                        onClick={() => setShowEscalationForm(false)}
                        style={{ fontSize: '11px', flex: 1 }}
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        className="gov-btn-primary"
                        onClick={() => {
                          escalateIncident(incident.id, escalationReason);
                          setShowEscalationForm(false);
                        }}
                        style={{ background: '#BE123C', borderColor: '#9F1239', color: '#FFFFFF', fontSize: '11px', flex: 2, fontWeight: 700 }}
                      >
                        Confirm State Escalation →
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Assignment Section (Shown when VALIDATED or ASSIGNED or IN_PROGRESS) */}
          {(incident.status === 'VALIDATED' || incident.status === 'ASSIGNED' || incident.status === 'IN_PROGRESS') && (
            <div className="drawer-section assignment-section-box">
              <h3 className="drawer-section-title">Assign Response Team</h3>
              <form onSubmit={handleAssignSubmit} className="gov-assign-form">
                <div className="form-field">
                  <label className="gov-form-label">Select Team</label>
                  <select
                    className="gov-form-select"
                    value={selectedTeam}
                    onChange={(e) => setSelectedTeam(e.target.value)}
                  >
                    <option value="NDRF Battalion 4">NDRF Battalion 4</option>
                    <option value="Municipal Task Force">Municipal Task Force</option>
                    <option value="Traffic Police">Traffic Police</option>
                    <option value="Fire & Rescue">Fire &amp; Rescue</option>
                  </select>
                </div>

                <div className="form-field">
                  <label className="gov-form-label">Select Priority</label>
                  <select
                    className="gov-form-select"
                    value={selectedPriority}
                    onChange={(e) => setSelectedPriority(e.target.value)}
                  >
                    <option value="Critical">Critical</option>
                    <option value="High">High</option>
                    <option value="Moderate">Moderate</option>
                  </select>
                </div>

                <button type="submit" className="gov-btn-primary full-width" style={{ marginBottom: '8px' }}>
                  Assign &amp; Dispatch Team
                </button>

                <button
                  type="button"
                  className="gov-btn-secondary full-width"
                  onClick={() => {
                    deployPumpAtNewPoint({
                      name: `Emergency Mobile Pump (${incident.location})`,
                      location: incident.location,
                      pumpCapacity: '10,000 L/min Submersible Pump Rig',
                    });
                  }}
                  style={{ fontSize: '12px', borderColor: '#0284C7', color: '#0284C7', background: '#F0F9FF' }}
                >
                  ⚡ Deploy Dewatering Pump Unit Here
                </button>
              </form>
            </div>
          )}
          {/* Admin Purge Capability */}
          {auth?.role === 'admin' && (
            <div className="drawer-section" style={{ marginTop: '20px', paddingTop: '14px', borderTop: '1px solid #E2E8F0' }}>
              <button
                className="gov-btn-secondary full-width"
                onClick={() => {
                  if (window.confirm(`Admin Override: Are you sure you want to purge incident #${incident.id}?`)) {
                    deleteIncident(incident.id);
                    onClose();
                  }
                }}
                style={{ color: '#B91C1C', borderColor: '#FCA5A5', background: '#FEF2F2', fontSize: '12px' }}
              >
                🗑️ Admin Purge Incident Record
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
