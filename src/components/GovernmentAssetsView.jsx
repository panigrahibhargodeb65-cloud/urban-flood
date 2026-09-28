import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { Building2, ShieldAlert, CheckCircle2, AlertTriangle, Filter, Plus, X, Zap } from 'lucide-react';

export default function GovernmentAssetsView() {
  const { assetsList, toggleAssetDeployment, deployPumpAtNewPoint, hotspots } = useApp();
  const [filterCategory, setFilterCategory] = useState('ALL');
  const [showDeployModal, setShowDeployModal] = useState(false);

  // New Pump Deployment Form State
  const [newPumpName, setNewPumpName] = useState('');
  const [newPumpLocation, setNewPumpLocation] = useState(hotspots[0]?.name || 'Khetrajpur Station Road Junction');
  const [customLocationInput, setCustomLocationInput] = useState('');
  const [newPumpCapacity, setNewPumpCapacity] = useState('8,000 L/min Mobile Dewatering Unit');
  const [newPumpCategory, setNewPumpCategory] = useState('Mobile Dewatering Unit');

  const filteredAssets = (assetsList || []).filter((ast) => {
    if (filterCategory === 'ALL') return true;
    if (filterCategory === 'HOSPITAL') return ast.category.includes('Hospital');
    if (filterCategory === 'FIRE') return ast.category.includes('Fire');
    if (filterCategory === 'POLICE') return ast.category.includes('Police');
    if (filterCategory === 'SHELTER') return ast.category.includes('Shelter');
    if (filterCategory === 'MOBILE_PUMP') return ast.category.includes('Mobile') || ast.category.includes('Pump');
    return true;
  });

  const getVulnerabilityBadge = (vuln) => {
    switch (vuln) {
      case 'CRITICAL':
        return <span className="risk-badge-text text-critical">● CRITICAL RISK</span>;
      case 'HIGH':
        return <span className="risk-badge-text text-high">● HIGH RISK</span>;
      case 'MODERATE':
        return <span className="risk-badge-text text-moderate">● MODERATE</span>;
      default:
        return <span className="risk-badge-text text-safe">● SAFE / PROTECTED</span>;
    }
  };

  const handleDeploySubmit = (e) => {
    e.preventDefault();
    const finalLocation =
      newPumpLocation === 'Custom Location Point' && customLocationInput.trim()
        ? customLocationInput.trim()
        : newPumpLocation;

    deployPumpAtNewPoint({
      name: newPumpName || `Mobile Dewatering Pump (${finalLocation})`,
      location: finalLocation,
      category: newPumpCategory,
      pumpCapacity: newPumpCapacity,
    });
    setNewPumpName('');
    setCustomLocationInput('');
    setShowDeployModal(false);
  };

  const deployedCount = assetsList.filter((a) => a.isDeployed).length;
  const criticalCount = assetsList.filter((a) => a.vulnerability === 'CRITICAL').length;

  return (
    <div className="gov-assets-view">
      {/* Page Header */}
      <div className="gov-page-header">
        <div className="page-header-title-area">
          <h1 className="gov-page-title">Critical Infrastructure &amp; Dewatering Pump Assets</h1>
          <p className="gov-page-description">
            Track flood vulnerability, deploy mobile dewatering pump units to new emergency points, and monitor readiness.
          </p>
        </div>
        <div className="page-header-meta" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <button
            className="gov-btn-primary"
            onClick={() => setShowDeployModal(true)}
            style={{ fontSize: '13px', padding: '6px 14px', display: 'inline-flex', alignItems: 'center', gap: '6px' }}
          >
            <Plus size={15} /> Deploy Pump at New Point
          </button>
          <span className="last-updated-text">Active Assets Monitored: <strong>{assetsList.length}</strong></span>
        </div>
      </div>

      {/* Summary Statistics Strip */}
      <div className="gov-summary-strip">
        <div className="summary-item">
          <span className="summary-number">{assetsList.length}</span>
          <span className="summary-label">Total Assets</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-item risk-critical-text">
          <span className="summary-number">{criticalCount}</span>
          <span className="summary-label">● Assets at Risk</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-item text-blue">
          <span className="summary-number">{deployedCount}</span>
          <span className="summary-label">Pumps Currently Active</span>
        </div>

        <div className="summary-divider" />

        <div className="summary-item text-safe">
          <span className="summary-number">{assetsList.length - deployedCount}</span>
          <span className="summary-label">Units on Standby</span>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-table-filter-bar">
        <span className="filter-title">Filter Asset Category:</span>
        {[
          { id: 'ALL', label: 'All Assets' },
          { id: 'HOSPITAL', label: 'Hospitals / Healthcare' },
          { id: 'FIRE', label: 'Fire & Rescue' },
          { id: 'POLICE', label: 'Police Divisions' },
          { id: 'SHELTER', label: 'Evacuation Shelters' },
          { id: 'MOBILE_PUMP', label: '⚡ Mobile Dewatering Units' },
        ].map((item) => (
          <button
            key={item.id}
            className={`gov-filter-btn ${filterCategory === item.id ? 'active' : ''}`}
            onClick={() => setFilterCategory(item.id)}
          >
            {item.label}
          </button>
        ))}
      </div>

      {/* Assets Table */}
      <div className="gov-table-container">
        <table className="gov-ops-table">
          <thead>
            <tr>
              <th>Asset / Pump Unit Name</th>
              <th>Category</th>
              <th>Nearest Hotspot / Point</th>
              <th>Proximity</th>
              <th>Vulnerability Status</th>
              <th>Emergency Readiness</th>
              <th style={{ textAlign: 'right' }}>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredAssets.map((ast) => (
              <tr key={ast.id} style={{ backgroundColor: ast.category.includes('Mobile') ? '#F0F9FF' : 'transparent' }}>
                <td className="font-semibold">
                  {ast.name}
                  {ast.category.includes('Mobile') && (
                    <span className="status-tag tag-validated" style={{ marginLeft: '6px', fontSize: '10px' }}>
                      Mobile Pump
                    </span>
                  )}
                </td>
                <td className="text-secondary">{ast.category}</td>
                <td>{ast.nearestHotspot}</td>
                <td className="font-mono">{ast.distance}</td>
                <td>{getVulnerabilityBadge(ast.vulnerability)}</td>
                <td>
                  <span className="status-text-pill">{ast.status}</span>
                </td>
                <td style={{ textAlign: 'right' }}>
                  <button
                    className={`gov-btn-table-action ${ast.isDeployed ? 'active' : ''}`}
                    onClick={() => toggleAssetDeployment(ast.id)}
                    style={{
                      backgroundColor: ast.isDeployed ? '#0284C7' : '#F1F5F9',
                      color: ast.isDeployed ? '#FFFFFF' : '#334155',
                      border: '1px solid #CBD5E1',
                      cursor: 'pointer',
                    }}
                  >
                    {ast.isDeployed ? '✓ Pump Active' : '+ Deploy Pump'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Deploy Pump at New Point Modal */}
      {showDeployModal && (
        <div className="gov-modal-backdrop" onClick={() => setShowDeployModal(false)}>
          <div className="gov-modal-box" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '520px' }}>
            <div className="modal-header-row">
              <h3 className="modal-title" style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                <Zap size={18} style={{ color: '#0284C7' }} /> Deploy Dewatering Pump at New Point
              </h3>
              <button className="gov-modal-close" onClick={() => setShowDeployModal(false)}>
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleDeploySubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px', marginTop: '14px' }}>
              <div className="form-field">
                <label className="gov-form-label">Pump Unit Name / Identification</label>
                <input
                  type="text"
                  className="gov-form-input"
                  placeholder="e.g. Station Road Underpass Dewatering Pump #2"
                  value={newPumpName}
                  onChange={(e) => setNewPumpName(e.target.value)}
                  required
                />
              </div>

              <div className="form-field">
                <label className="gov-form-label">Deployment Point / Location</label>
                <select
                  className="gov-form-select"
                  value={newPumpLocation}
                  onChange={(e) => setNewPumpLocation(e.target.value)}
                >
                  {hotspots.map((h) => (
                    <option key={h.id} value={h.name}>
                      {h.name} ({h.zone})
                    </option>
                  ))}
                  <option value="Custom Location Point">Custom Critical Location Point...</option>
                </select>

                {newPumpLocation === 'Custom Location Point' && (
                  <input
                    type="text"
                    className="gov-form-input"
                    style={{ marginTop: '8px' }}
                    placeholder="Type custom location name (e.g. Modipara Chowk)"
                    value={customLocationInput}
                    onChange={(e) => setCustomLocationInput(e.target.value)}
                    required
                  />
                )}
              </div>

              <div className="form-field">
                <label className="gov-form-label">Pump Capacity Rating</label>
                <select
                  className="gov-form-select"
                  value={newPumpCapacity}
                  onChange={(e) => setNewPumpCapacity(e.target.value)}
                >
                  <option value="5,000 L/min Dewatering Unit">5,000 L/min (Medium Duty)</option>
                  <option value="8,000 L/min Mobile Dewatering Unit">8,000 L/min (Heavy Duty Mobile)</option>
                  <option value="12,000 L/min Submersible Pump Truck">12,000 L/min (High Capacity Truck Unit)</option>
                  <option value="15,000 L/min High-Volume Dewatering Rig">15,000 L/min (High-Volume Emergency Rig)</option>
                </select>
              </div>

              <div className="form-field">
                <label className="gov-form-label">Unit Category</label>
                <input
                  type="text"
                  className="gov-form-input"
                  value={newPumpCategory}
                  onChange={(e) => setNewPumpCategory(e.target.value)}
                />
              </div>

              <div style={{ display: 'flex', gap: '10px', justifyContent: 'flex-end', marginTop: '10px' }}>
                <button
                  type="button"
                  className="gov-btn-secondary"
                  onClick={() => setShowDeployModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="gov-btn-primary">
                  Deploy Pump Unit Now →
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
