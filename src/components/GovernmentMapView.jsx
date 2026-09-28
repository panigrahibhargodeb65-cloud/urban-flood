import React from 'react';
import { useApp } from '../context/AppContext';
import FloodMap from './FloodMap';
import ForecastTimeline from './ForecastTimeline';
import { Map, Sparkles } from 'lucide-react';

export default function GovernmentMapView() {
  const {
    hotspots,
    currentStepId,
    setForecastStep,
    selectedHotspot,
    selectHotspot,
  } = useApp();

  return (
    <div className="gov-map-view-section">
      {/* Page Header */}
      <div className="gov-page-header">
        <div className="page-header-title-area">
          <h1 className="gov-page-title" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <Map size={22} style={{ color: 'var(--blue-primary)' }} />
            GIS Flood Map Intelligence
            <span className="ai-status-tag">
              <Sparkles size={13} /> Full Interactive GIS Map
            </span>
          </h1>
          <p className="gov-page-description">
            Real-time 2D spatial visualization, live sensor overlays, drainage networks, road status and critical municipal assets.
          </p>
        </div>
        <div className="page-header-meta">
          <span className="last-updated-text">Active GIS Layers: <strong>5 Layers Enabled</strong></span>
          <span className="status-online-dot">● GIS Live</span>
        </div>
      </div>

      {/* Full-width Map Canvas Workspace */}
      <div className="full-map-workspace" style={{ height: '620px', borderRadius: '4px', overflow: 'hidden', border: '1px solid var(--border-light)', boxShadow: 'var(--shadow-subtle)', position: 'relative', marginBottom: '20px' }}>
        <FloodMap
          hotspotsData={hotspots}
          selectedHotspot={selectedHotspot}
          onSelectHotspot={(item) => selectHotspot(item.id)}
          currentStepId={currentStepId}
        />
      </div>

      {/* Bottom Timeline */}
      <ForecastTimeline
        currentStepId={currentStepId}
        setCurrentStepId={setForecastStep}
        selectedHotspot={selectedHotspot}
      />
    </div>
  );
}
