import React, { useState } from 'react';
import { Search } from 'lucide-react';

export default function PriorityHotspots({
  hotspotsData,
  selectedHotspot,
  onSelectHotspot,
  currentStepId,
}) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSeverity, setFilterSeverity] = useState('ALL');

  const filteredHotspots = hotspotsData.filter((item) => {
    const stepInfo = item.timelineData[currentStepId] || item.timelineData.now;
    const severity = stepInfo.severity;

    const matchesSearch =
      item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.zone.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (item.code || '').toLowerCase().includes(searchQuery.toLowerCase());

    const matchesFilter =
      filterSeverity === 'ALL' || severity === filterSeverity;

    return matchesSearch && matchesFilter;
  });

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
    <aside className="gov-priority-panel">
      <div className="priority-panel-header">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 className="priority-title">Priority Hotspots ({filteredHotspots.length})</h2>
          <span style={{ fontSize: '10px', color: 'var(--text-muted)' }}>Presentation: <strong>cm</strong></span>
        </div>

        {/* Search Input */}
        <div className="gov-search-wrap" style={{ marginTop: '8px' }}>
          <Search size={14} className="search-icon" />
          <input
            type="text"
            className="gov-search-input"
            placeholder="Search hotspot #01, location..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        {/* Filter Tab Buttons */}
        <div className="gov-filter-group" role="tablist" aria-label="Filter Severity" style={{ marginTop: '8px' }}>
          {['ALL', 'CRITICAL', 'HIGH', 'MODERATE'].map((filter) => (
            <button
              key={filter}
              className={`gov-filter-btn ${filterSeverity === filter ? 'active' : ''}`}
              onClick={() => setFilterSeverity(filter)}
            >
              {filter === 'ALL' ? 'All' : filter.charAt(0) + filter.slice(1).toLowerCase()}
            </button>
          ))}
        </div>
      </div>

      {/* Hotspots Compact List */}
      <div className="priority-list-container">
        {filteredHotspots.length === 0 ? (
          <div className="gov-empty-list">No matching hotspots found.</div>
        ) : (
          filteredHotspots.map((item) => {
            const stepInfo = item.timelineData[currentStepId] || item.timelineData.now;
            const depthCm = stepInfo.depthCm || Math.round(stepInfo.depth * 100);
            const isSelected = selectedHotspot?.id === item.id;
            const riskClass = getRiskColorClass(stepInfo.severity);

            return (
              <div
                key={item.id}
                className={`priority-item-row ${isSelected ? 'selected' : ''}`}
                onClick={() => onSelectHotspot(item)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    onSelectHotspot(item);
                  }
                }}
              >
                <div className="row-top-info">
                  <span className={`risk-badge-text ${riskClass}`}>
                    {item.code || '#03'} {getRiskLabelText(stepInfo.severity)}
                  </span>
                  <span className="row-depth-text" style={{ fontWeight: 800, fontSize: '13px' }}>
                    {depthCm} cm
                  </span>
                </div>

                <h3 className="row-hotspot-name">{item.name}</h3>

                <div className="row-bottom-info" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span className="row-onset-text">
                    Onset: {stepInfo.onset === 0 ? 'Active now' : `${stepInfo.onset} min`}
                  </span>
                  <span style={{ fontSize: '10px', color: '#0284C7', fontWeight: 700 }}>
                    Priority: {item.incidentPriority || 'P1'}
                  </span>
                </div>
              </div>
            );
          })
        )}
      </div>
    </aside>
  );
}
