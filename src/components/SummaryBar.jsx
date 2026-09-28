import React from 'react';
import { useApp } from '../context/AppContext';
import { Activity, ShieldCheck, CloudRain } from 'lucide-react';

export default function SummaryBar({ hotspotsData, currentStepId }) {
  const { incidents } = useApp();

  let criticalCount = 0;
  let highCount = 0;
  let maxDepthCm = 0;

  hotspotsData.forEach((h) => {
    const stepData = h.timelineData[currentStepId] || h.timelineData.now;
    const depthCm = stepData.depthCm || Math.round(stepData.depth * 100);
    if (depthCm > maxDepthCm) maxDepthCm = depthCm;

    const sev = stepData.severity;
    if (sev === 'CRITICAL') criticalCount++;
    else if (sev === 'HIGH') highCount++;
  });

  const openIncidentsCount = incidents ? incidents.filter((i) => i.status !== 'RESOLVED' && i.status !== 'REJECTED').length : 0;
  const activeHotspotsCount = hotspotsData ? hotspotsData.length : 6;
  const affectedRoads = 8;

  return (
    <div className="gov-summary-strip">
      <div className="summary-item">
        <span className="summary-number">{openIncidentsCount}</span>
        <span className="summary-label">Open Incidents</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-item risk-critical-text">
        <span className="summary-number">{criticalCount}</span>
        <span className="summary-label">● Critical Hotspots</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-item risk-high-text">
        <span className="summary-number">{highCount}</span>
        <span className="summary-label">● High Risk Areas</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-item">
        <span className="summary-number" style={{ color: '#0284C7' }}>{maxDepthCm} cm</span>
        <span className="summary-label">Max Nowcast Depth (cm)</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-item">
        <span className="summary-number">{activeHotspotsCount}</span>
        <span className="summary-label">Monitored Zones</span>
      </div>

      <div className="summary-divider" />

      <div className="summary-item">
        <span className="summary-number">{affectedRoads}</span>
        <span className="summary-label">Affected Corridors</span>
      </div>
    </div>
  );
}
