import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { ShieldAlert, Plus, Send, AlertTriangle, CheckCircle2, UserX, Building2, Bell, Sparkles, X } from 'lucide-react';

export default function ProfessorComplaintsView() {
  const {
    professorComplaints = [],
    lodgeProfessorComplaint,
    citizenReports = [],
    addressUnsolvedReport,
    sendNotificationToMunicipalAdmin,
    incidents = [],
  } = useApp();

  const [showLodgeModal, setShowLodgeModal] = useState(false);
  const [profName, setProfName] = useState('');
  const [department, setDepartment] = useState('');
  const [institution, setInstitution] = useState('VSSUT Burla / Institutional Drainage Nodal Cell');
  const [location, setLocation] = useState('Campus Perimeter Drain Gate 3');
  const [severity, setSeverity] = useState('CRITICAL');
  const [description, setDescription] = useState('');

  // Unsolved Citizen Reports addressing state
  const [addressingReportId, setAddressingReportId] = useState(null);
  const [govtDirectiveText, setGovtDirectiveText] = useState('');

  // Filtered lists
  const escalatedComplaints = professorComplaints.filter((p) => p.escalatedToHigherAuthority);
  const unsolvedReports = citizenReports.filter(
    (r) => r.status === 'UNSOLVED_BY_CITIZEN' || (r.citizenFeedback && r.status !== 'RESOLVED')
  );
  const stateEscalatedIncidents = incidents.filter((i) => i.status === 'ESCALATED' || i.isEscalated);

  const handleSubmitProfComplaint = (e) => {
    e.preventDefault();
    lodgeProfessorComplaint({
      professorName: profName || 'Dr. A.K. Panda',
      department: department || 'Department of Civil Engineering & Campus Nodal',
      institution: institution || 'VSSUT Burla / Institutional Drainage Cell',
      location: location || 'VSSUT Gate 3 Culvert Outlet',
      severity,
      description: description || 'Failure to clear private campus culverts causing storm overflow into main public boulevard.',
    });

    setProfName('');
    setDepartment('');
    setDescription('');
    setShowLodgeModal(false);
  };

  const handleAddressSubmit = (reportId) => {
    addressUnsolvedReport(reportId, govtDirectiveText || 'Deploy High Capacity Dewatering Rig & Clear Secondary Drain');
    setAddressingReportId(null);
    setGovtDirectiveText('');
  };

  return (
    <div className="gov-prof-complaints-view" style={{ marginTop: '10px' }}>
      {/* Header */}
      <div className="gov-page-header">
        <div className="page-header-title-area">
          <h1 className="gov-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            Government Executive Privileges &amp; Escalations
            <span className="ai-status-tag" style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FDA4AF' }}>
              <ShieldAlert size={13} /> Higher Authority Command
            </span>
          </h1>
          <p className="gov-page-description">
            Lodge complaints against non-compliant institutional nodal officers / professors, inspect state-escalated emergencies, and address unsolved citizen flood reports.
          </p>
        </div>

        <div className="page-header-meta" style={{ display: 'flex', gap: '10px' }}>
          <button
            className="gov-btn-primary"
            onClick={() => setShowLodgeModal(true)}
            style={{ background: '#BE123C', borderColor: '#9F1239', color: '#FFFFFF', padding: '8px 14px', fontSize: '13px', display: 'inline-flex', alignItems: 'center', gap: '6px', fontWeight: 700 }}
          >
            <UserX size={16} /> Lodge Complaint Against Professor
          </button>
        </div>
      </div>

      {/* Summary Metrics Strip */}
      <div className="gov-summary-strip" style={{ marginBottom: '20px' }}>
        <div className="summary-item">
          <span className="summary-number">{professorComplaints.length}</span>
          <span className="summary-label">Professor Complaints</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item risk-critical-text">
          <span className="summary-number">{escalatedComplaints.length + stateEscalatedIncidents.length}</span>
          <span className="summary-label">● Escalated to State Command</span>
        </div>
        <div className="summary-divider" />
        <div className="summary-item risk-high-text">
          <span className="summary-number">{unsolvedReports.length}</span>
          <span className="summary-label">⚠️ Citizen Unsolved Flags</span>
        </div>
      </div>

      {/* Section 1: Address Unsolved Citizen Reports */}
      {unsolvedReports.length > 0 && (
        <div style={{ background: '#FFF1F2', border: '1px solid #FDA4AF', borderRadius: '8px', padding: '16px', marginBottom: '24px' }}>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px' }}>
            <h3 style={{ margin: 0, color: '#BE123C', fontSize: '15px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
              ⚠️ Citizen Unsolved Flood Complaints Needing Government Action ({unsolvedReports.length})
            </h3>
            <span style={{ fontSize: '11px', color: '#9F1239', fontWeight: 700 }}>Government Admin Action Required</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            {unsolvedReports.map((rep) => (
              <div key={rep.id} style={{ background: '#FFFFFF', padding: '12px 16px', borderRadius: '6px', border: '1px solid #FECDD3' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px' }}>
                  <span style={{ fontWeight: 800, color: '#0F172A', fontSize: '13px' }}>
                    Report #{rep.id} • {rep.location}
                  </span>
                  <span style={{ background: '#BE123C', color: '#FFFFFF', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>
                    CITIZEN FLAGGED UNSOLVED
                  </span>
                </div>

                <p style={{ margin: '4px 0 8px 0', fontSize: '12px', color: '#881337', background: '#FFF1F2', padding: '6px 10px', borderRadius: '4px' }}>
                  <strong>Citizen Feedback:</strong> "{rep.citizenFeedback || 'Water remains knee deep; initial pump action insufficient.'}"
                </p>

                {addressingReportId === rep.id ? (
                  <div style={{ marginTop: '10px', background: '#F8FAFC', padding: '10px', borderRadius: '6px', border: '1px solid #CBD5E1' }}>
                    <label className="gov-form-label" style={{ fontSize: '11px' }}>Govt Directive / Action Plan:</label>
                    <textarea
                      className="gov-form-input"
                      rows="2"
                      placeholder="e.g. Dispatching 15,000 L/min Submersible Pump Truck & clearing main drainage outlet"
                      value={govtDirectiveText}
                      onChange={(e) => setGovtDirectiveText(e.target.value)}
                      style={{ fontSize: '12px', marginBottom: '8px' }}
                    />
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                      <button className="gov-btn-secondary btn-sm" onClick={() => setAddressingReportId(null)}>
                        Cancel
                      </button>
                      <button
                        className="gov-btn-primary btn-sm"
                        onClick={() => handleAddressSubmit(rep.id)}
                        style={{ background: '#0284C7', borderColor: '#0369A1' }}
                      >
                        🔔 Address Issue &amp; Notify Municipal Admin →
                      </button>
                    </div>
                  </div>
                ) : (
                  <button
                    className="gov-btn-primary btn-sm"
                    onClick={() => setAddressingReportId(rep.id)}
                    style={{ background: '#BE123C', borderColor: '#9F1239', color: '#FFFFFF', fontSize: '12px' }}
                  >
                    Address Citizen Complaint &amp; Send Municipal Directive →
                  </button>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Section 2: Complaints Lodged Against Specific Professors */}
      <div className="gov-table-container" style={{ marginBottom: '24px' }}>
        <div style={{ padding: '14px 16px', background: '#0F172A', color: '#F8FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            <UserX size={16} style={{ color: '#F43F5E' }} /> Official Institutional Complaints Against Professors &amp; Nodal Officers
          </h3>
          <span style={{ fontSize: '11px', color: '#94A3B8' }}>State Level Disciplinary Oversight</span>
        </div>

        <table className="gov-ops-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Professor / Nodal Officer</th>
              <th>Department / Institution</th>
              <th>Campus Location</th>
              <th>Severity</th>
              <th>Escalated to Higher Authority</th>
              <th>Higher Authority Action Notes</th>
            </tr>
          </thead>
          <tbody>
            {professorComplaints.map((prof) => (
              <tr key={prof.id} style={{ backgroundColor: prof.severity === 'CRITICAL' ? '#FFF1F2' : 'transparent' }}>
                <td className="font-mono" style={{ fontWeight: 800, color: '#BE123C' }}>#{prof.id}</td>
                <td className="font-semibold" style={{ color: '#0F172A' }}>
                  {prof.professorName}
                  <div style={{ fontSize: '11px', color: '#64748B', fontWeight: 400 }}>Logged by: {prof.loggedBy}</div>
                </td>
                <td className="text-secondary" style={{ fontSize: '12px' }}>
                  <strong>{prof.department}</strong>
                  <div>{prof.institution}</div>
                </td>
                <td className="font-medium" style={{ fontSize: '12px' }}>{prof.location}</td>
                <td>
                  <span className="risk-badge-text" style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FDA4AF', padding: '2px 8px', borderRadius: '10px', fontSize: '10px', fontWeight: 800 }}>
                    ● {prof.severity}
                  </span>
                </td>
                <td>
                  {prof.escalatedToHigherAuthority ? (
                    <span style={{ background: '#BE123C', color: '#FFFFFF', padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                      🚨 ESCALATED TO HIGHER AUTHORITY
                    </span>
                  ) : (
                    <span className="status-tag tag-validated">Pending Escalation</span>
                  )}
                </td>
                <td style={{ fontSize: '11px', color: '#334155', maxWidth: '240px' }}>
                  {prof.higherAuthorityNotes || prof.description}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Section 3: State & Higher Authority Escalated Emergencies Feed */}
      <div className="gov-table-container">
        <div style={{ padding: '14px 16px', background: '#475569', color: '#F8FAFB', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h3 style={{ margin: 0, fontSize: '14px', fontWeight: 800, display: 'flex', alignItems: 'center', gap: '8px' }}>
            🚨 Master Feed: All Incidents Escalated to Higher Authorities &amp; NDRF
          </h3>
          <span style={{ fontSize: '11px', color: '#CBD5E1' }}>State Emergency Control Room Sync</span>
        </div>

        <table className="gov-ops-table">
          <thead>
            <tr>
              <th>Seq #</th>
              <th>Incident ID</th>
              <th>Location</th>
              <th>Assigned Higher Authority Unit</th>
              <th>Escalation Reason</th>
              <th>Current Status</th>
            </tr>
          </thead>
          <tbody>
            {stateEscalatedIncidents.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '20px', color: '#64748B' }}>
                  No active state-escalated incidents.
                </td>
              </tr>
            ) : (
              stateEscalatedIncidents.map((inc, index) => (
                <tr key={inc.id} style={{ background: '#FFF1F2' }}>
                  <td className="font-mono">#{index + 1}</td>
                  <td className="font-mono font-bold" style={{ color: '#BE123C' }}>#{inc.id}</td>
                  <td className="font-medium">{inc.location}</td>
                  <td className="font-semibold" style={{ color: '#881337' }}>{inc.assignedTeam}</td>
                  <td style={{ fontSize: '11px', color: '#9F1239' }}>{inc.escalationReason || 'Critical water depth & infrastructure threat'}</td>
                  <td>
                    <span style={{ background: '#BE123C', color: '#FFFFFF', padding: '3px 8px', borderRadius: '12px', fontSize: '10px', fontWeight: 800 }}>
                      🚨 ESCALATED TO STATE
                    </span>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Lodge Professor Complaint Modal */}
      {showLodgeModal && (
        <div className="gov-modal-backdrop" onClick={() => setShowLodgeModal(false)}>
          <div className="gov-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '540px' }}>
            <div className="modal-header-row">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px', color: '#BE123C' }}>
                <UserX size={18} /> Lodge Complaint Against Professor / Nodal Officer
              </h3>
              <button className="gov-modal-close" onClick={() => setShowLodgeModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleSubmitProfComplaint} style={{ display: 'flex', flexDirection: 'column', gap: '12px', marginTop: '14px' }}>
              <div className="form-field">
                <label className="gov-form-label">Professor / Nodal Officer Name</label>
                <input
                  type="text"
                  className="gov-form-input"
                  placeholder="e.g. Dr. A.K. Panda or Prof. S. Mohanty"
                  value={profName}
                  onChange={(e) => setProfName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="gov-form-label">Department &amp; Campus Designation</label>
                <input
                  type="text"
                  className="gov-form-input"
                  placeholder="e.g. Department of Civil Engineering &amp; Campus Drainage Nodal"
                  value={department}
                  onChange={(e) => setDepartment(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="gov-form-label">Institution Name</label>
                <input
                  type="text"
                  className="gov-form-input"
                  value={institution}
                  onChange={(e) => setInstitution(e.target.value)}
                />
              </div>

              <div className="form-field">
                <label className="gov-form-label">Campus Location / Drainage Gate</label>
                <input
                  type="text"
                  className="gov-form-input"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="gov-form-label">Severity Level</label>
                <select className="gov-form-select" value={severity} onChange={(e) => setSeverity(e.target.value)}>
                  <option value="CRITICAL">● CRITICAL (Immediate Highway Overflow / Hazard)</option>
                  <option value="HIGH">● HIGH (Campus Construction Debris Clogging)</option>
                  <option value="MODERATE">● MODERATE (Culvert Maintenance Delay)</option>
                </select>
              </div>

              <div className="form-field">
                <label className="gov-form-label">Failure Description &amp; Compliance Violation Notes</label>
                <textarea
                  className="gov-form-input"
                  rows="3"
                  placeholder="Describe drainage failure, lack of response to municipal notice, or construction debris blocking public storm drains..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                />
              </div>

              <div style={{ background: '#FFF1F2', padding: '10px', borderRadius: '6px', fontSize: '11px', color: '#9F1239', border: '1px solid #FDA4AF' }}>
                🚨 <strong>Automatic Escalation Notice:</strong> Lodging this official complaint automatically escalates the file to the Higher Education Directorate &amp; District State Emergency Command, and dispatches a notification to the Municipal Admin.
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button type="button" className="gov-btn-secondary" onClick={() => setShowLodgeModal(false)}>
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary" style={{ background: '#BE123C', borderColor: '#9F1239', color: '#FFFFFF', fontWeight: 700 }}>
                  Submit Complaint &amp; Escalate to State →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
