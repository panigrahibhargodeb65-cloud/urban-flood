import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import GlobalHeader from './GlobalHeader';
import Footer from './Footer';
import {
  ArrowLeft,
  Search,
  CheckCircle2,
  Clock,
  ShieldCheck,
  Truck,
  AlertTriangle,
  MapPin,
  Sparkles,
  Share2,
} from 'lucide-react';

export default function ReportingStatusPage({ onBack, setActiveNav }) {
  const { citizenReports, incidents, showToast, flagReportUnsolved } = useApp();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Unsolved issue flagging state
  const [flaggingReportId, setFlaggingReportId] = useState(null);
  const [unsolvedReasonText, setUnsolvedReasonText] = useState('');

  // Map reports with matching incident status if available
  const enrichedReports = citizenReports.map((rep) => {
    // Find matching incident by location or ID
    const matchingInc = incidents.find(
      (inc) =>
        inc.location.toLowerCase().includes(rep.location.toLowerCase()) ||
        rep.location.toLowerCase().includes(inc.location.toLowerCase())
    );

    const liveStatus = matchingInc ? matchingInc.status : rep.status;
    const assignedTeam = matchingInc ? matchingInc.assignedTeam : null;

    return {
      ...rep,
      liveStatus,
      assignedTeam,
      incidentId: matchingInc ? matchingInc.id : null,
    };
  });

  const filteredReports = enrichedReports.filter((rep) => {
    const matchesSearch =
      rep.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
      rep.category.toLowerCase().includes(searchTerm.toLowerCase());

    if (filterStatus === 'ALL') return matchesSearch;
    return matchesSearch && rep.liveStatus === filterStatus;
  });

  const getStatusStepIndex = (status) => {
    switch (status) {
      case 'REPORTED':
        return 1;
      case 'VALIDATED':
        return 2;
      case 'ASSIGNED':
      case 'IN_PROGRESS':
      case 'ESCALATED':
        return 3;
      case 'RESOLVED':
        return 4;
      default:
        return 1;
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'REPORTED':
        return <span className="status-tag tag-reported">● Under Review</span>;
      case 'VALIDATED':
        return <span className="status-tag tag-validated">● Verified</span>;
      case 'ASSIGNED':
      case 'IN_PROGRESS':
        return <span className="status-tag tag-assigned">● Response Dispatched</span>;
      case 'ESCALATED':
        return (
          <span className="status-tag" style={{ background: '#FFF1F2', color: '#BE123C', border: '1px solid #FDA4AF', fontWeight: 800 }}>
            🚨 ESCALATED TO STATE COMMAND
          </span>
        );
      case 'RESOLVED':
        return <span className="status-tag tag-resolved">● Resolved &amp; Safe</span>;
      default:
        return <span className="status-tag tag-reported">● Submitted</span>;
    }
  };

  const handleShare = (reportId) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(
        `Tracking Flood Report #${reportId} on Urban Flood Intelligence Portal.`
      );
      showToast(`Report #${reportId} link copied to clipboard!`);
    }
  };

  return (
    <div className="gov-page-root">
      <GlobalHeader activeNav="reportStatus" setActiveNav={setActiveNav} />

      <main className="gov-citizen-main" id="main-content">
        {/* Back Link */}
        <div className="back-link-wrapper" style={{ marginBottom: '16px' }}>
          <button className="gov-back-btn" onClick={onBack}>
            <ArrowLeft size={16} />
            <span>Back to Flood Risk</span>
          </button>
        </div>

        {/* Page Header */}
        <div className="gov-page-header">
          <div className="page-header-title-area">
            <h1 className="gov-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              Citizen Flood Report Tracking
              <span className="ai-status-tag">
                <Sparkles size={13} /> Live Verification Pipeline
              </span>
            </h1>
            <p className="gov-page-description">
              Track real-time validation status, control room actions, and response team dispatches for your flood observations.
            </p>
          </div>
          <div className="page-header-meta">
            <button
              className="gov-btn-primary"
              onClick={() => {
                if (setActiveNav) setActiveNav('report');
              }}
            >
              + Submit New Report
            </button>
          </div>
        </div>

        {/* Summary Statistics Strip */}
        <div className="gov-summary-strip" style={{ marginBottom: '24px' }}>
          <div className="summary-item">
            <span className="summary-number">{citizenReports.length}</span>
            <span className="summary-label">Submitted Reports</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item text-blue">
            <span className="summary-number">
              {enrichedReports.filter((r) => r.liveStatus === 'REPORTED').length}
            </span>
            <span className="summary-label">● Under Review</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item risk-high-text">
            <span className="summary-number">
              {enrichedReports.filter((r) => r.liveStatus === 'VALIDATED' || r.liveStatus === 'ASSIGNED').length}
            </span>
            <span className="summary-label">● Verified &amp; Dispatched</span>
          </div>

          <div className="summary-divider" />

          <div className="summary-item text-safe">
            <span className="summary-number">
              {enrichedReports.filter((r) => r.liveStatus === 'RESOLVED').length}
            </span>
            <span className="summary-label">● Cleared / Resolved</span>
          </div>
        </div>

        {/* Search & Filter Controls */}
        <div className="report-status-filter-bar">
          <div className="search-input-group">
            <Search size={16} className="search-icon" />
            <input
              type="text"
              className="gov-search-input"
              placeholder="Search by Report ID (#REP-801), location, or category..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="filter-buttons-group">
            {['ALL', 'REPORTED', 'VALIDATED', 'ASSIGNED', 'RESOLVED'].map((st) => (
              <button
                key={st}
                className={`gov-filter-btn ${filterStatus === st ? 'active' : ''}`}
                onClick={() => setFilterStatus(st)}
              >
                {st === 'ALL'
                  ? 'All Statuses'
                  : st === 'REPORTED'
                  ? 'Under Review'
                  : st === 'VALIDATED'
                  ? 'Verified'
                  : st === 'ASSIGNED'
                  ? 'Dispatched'
                  : 'Resolved'}
              </button>
            ))}
          </div>
        </div>

        {/* List of Report Status Cards */}
        <div className="report-cards-stack">
          {filteredReports.length === 0 ? (
            <div className="empty-reports-card">
              <AlertTriangle size={32} className="text-muted" style={{ margin: '0 auto 12px' }} />
              <h3>No flood reports found</h3>
              <p>No report matches your search filter "{searchTerm}".</p>
            </div>
          ) : (
            filteredReports.map((rep) => {
              const stepIdx = getStatusStepIndex(rep.liveStatus);

              return (
                <div key={rep.id} className="report-status-card">
                  {/* Card Header */}
                  <div className="report-card-header">
                    <div className="rep-id-location">
                      <span className="rep-id-badge">#{rep.id}</span>
                      <h2 className="rep-card-title">
                        <MapPin size={16} className="pin-icon" /> {rep.location}
                      </h2>
                    </div>
                    {getStatusBadge(rep.liveStatus)}
                  </div>

                  {/* Key Report Details */}
                  <div className="rep-details-grid">
                    <div className="rep-detail-item">
                      <span className="d-label">Submitted Time:</span>
                      <span className="d-val font-semibold">{rep.time}</span>
                    </div>
                    <div className="rep-detail-item">
                      <span className="d-label">Reported Water Depth:</span>
                      <span className="d-val font-semibold text-critical">{rep.depthText}</span>
                    </div>
                    <div className="rep-detail-item">
                      <span className="d-label">Category:</span>
                      <span className="d-val">{rep.category}</span>
                    </div>
                    <div className="rep-detail-item">
                      <span className="d-label">Assigned Response Team:</span>
                      <span className="d-val font-semibold text-blue">
                        {rep.assignedTeam ? rep.assignedTeam : 'Awaiting Dispatch'}
                      </span>
                    </div>
                  </div>

                  {/* Visual 4-Step Pipeline Tracker */}
                  <div className="report-pipeline-tracker">
                    <div className={`pipeline-step ${stepIdx >= 1 ? 'completed' : ''} ${stepIdx === 1 ? 'current' : ''}`}>
                      <div className="step-circle">1</div>
                      <span className="step-label">Submitted</span>
                    </div>
                    <div className={`pipeline-line ${stepIdx >= 2 ? 'active' : ''}`} />

                    <div className={`pipeline-step ${stepIdx >= 2 ? 'completed' : ''} ${stepIdx === 2 ? 'current' : ''}`}>
                      <div className="step-circle">2</div>
                      <span className="step-label">Control Room Verified</span>
                    </div>
                    <div className={`pipeline-line ${stepIdx >= 3 ? 'active' : ''}`} />

                    <div className={`pipeline-step ${stepIdx >= 3 ? 'completed' : ''} ${stepIdx === 3 ? 'current' : ''}`}>
                      <div className="step-circle">3</div>
                      <span className="step-label">Team Dispatched</span>
                    </div>
                    <div className={`pipeline-line ${stepIdx >= 4 ? 'active' : ''}`} />

                    <div className={`pipeline-step ${stepIdx >= 4 ? 'completed' : ''} ${stepIdx === 4 ? 'current' : ''}`}>
                      <div className="step-circle">4</div>
                      <span className="step-label">Resolved</span>
                    </div>
                  </div>

                  {/* Verification Note / Description Box */}
                  <div className="rep-note-box">
                    <ShieldCheck size={16} className="text-blue" />
                    <span>
                      {rep.liveStatus === 'RESOLVED'
                        ? 'Action completed. Water levels receded and road hazard cleared.'
                        : rep.liveStatus === 'ASSIGNED' || rep.liveStatus === 'IN_PROGRESS'
                        ? `Response in progress: ${rep.assignedTeam || 'Emergency Unit'} deployed.`
                        : rep.liveStatus === 'VALIDATED'
                        ? ' Verified by municipal radar telemetry & field evidence.'
                        : ' Under review by municipal emergency operations center.'}
                    </span>
                  </div>

                  {/* Card Actions & Citizen Re-Open Unsolved Form */}
                  <div className="rep-card-actions" style={{ flexDirection: 'column', alignItems: 'stretch', gap: '8px' }}>
                    <div style={{ display: 'flex', gap: '8px', justifyContent: 'space-between' }}>
                      <button
                        className="gov-btn-secondary btn-sm"
                        onClick={() => handleShare(rep.id)}
                        style={{ display: 'inline-flex', alignItems: 'center', gap: '6px' }}
                      >
                        <Share2 size={14} />
                        Share Report Link
                      </button>

                      {rep.liveStatus !== 'UNSOLVED_BY_CITIZEN' && (
                        <button
                          className="gov-btn-secondary btn-sm"
                          onClick={() => setFlaggingReportId(flaggingReportId === rep.id ? null : rep.id)}
                          style={{ borderColor: '#FCA5A5', color: '#BE123C', background: '#FFF1F2', fontSize: '11px', fontWeight: 700 }}
                        >
                          ⚠️ Issue Still Not Solved? Flag Government
                        </button>
                      )}

                      <button
                        className="gov-btn-primary btn-sm"
                        onClick={() => {
                          if (setActiveNav) setActiveNav('risk');
                        }}
                      >
                        View Live Map Risk →
                      </button>
                    </div>

                    {flaggingReportId === rep.id && (
                      <div style={{ background: '#FFF1F2', border: '1px solid #FDA4AF', padding: '10px', borderRadius: '6px', marginTop: '6px' }}>
                        <label className="gov-form-label" style={{ color: '#BE123C', fontSize: '11px' }}>Describe why the flood issue remains unsolved:</label>
                        <textarea
                          className="gov-form-input"
                          rows="2"
                          placeholder="e.g. Water is still 50 cm deep near shop entrance; pump stopped working..."
                          value={unsolvedReasonText}
                          onChange={(e) => setUnsolvedReasonText(e.target.value)}
                          style={{ fontSize: '12px', marginBottom: '8px' }}
                        />
                        <div style={{ display: 'flex', gap: '8px', justifyContent: 'flex-end' }}>
                          <button className="gov-btn-secondary btn-sm" onClick={() => setFlaggingReportId(null)}>
                            Cancel
                          </button>
                          <button
                            className="gov-btn-primary btn-sm"
                            onClick={() => {
                              flagReportUnsolved(rep.id, unsolvedReasonText);
                              setFlaggingReportId(null);
                              setUnsolvedReasonText('');
                            }}
                            style={{ background: '#BE123C', borderColor: '#9F1239', color: '#FFFFFF', fontWeight: 700 }}
                          >
                            Flag Issue as Unsolved to Government Admin →
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
