import React from 'react';
import { TIMELINE_STEPS } from '../data/centralData';

export default function ForecastTimeline({
  currentStepId,
  setCurrentStepId,
  selectedHotspot,
}) {
  const currentStepIndex = TIMELINE_STEPS.findIndex(
    (step) => step.id === currentStepId
  );

  const selectedStepInfo = selectedHotspot
    ? selectedHotspot.timelineData[currentStepId] || selectedHotspot.timelineData.now
    : null;

  const depthCm = selectedStepInfo ? (selectedStepInfo.depthCm || Math.round(selectedStepInfo.depth * 100)) : 0;

  return (
    <footer className="gov-forecast-bar">
      <div className="forecast-title-row">
        <h3 className="forecast-heading">Flood Forecast — 0 to 3 Hours Nowcast</h3>
        {selectedHotspot && selectedStepInfo && (
          <span className="forecast-active-info">
            Forecast for <strong>{selectedHotspot.name}</strong> ({selectedHotspot.code || '#03'}): Depth <strong>{depthCm} cm</strong> ({selectedStepInfo.depth.toFixed(2)}m) (
            <span className={`forecast-risk-text risk-${selectedStepInfo.severity.toLowerCase()}`}>
              ● {selectedStepInfo.severity}
            </span>
            )
          </span>
        )}
      </div>

      <div className="forecast-timeline-track">
        <div className="timeline-steps-buttons">
          {TIMELINE_STEPS.map((step) => {
            const isActive = step.id === currentStepId;
            return (
              <button
                key={step.id}
                className={`forecast-step-btn ${isActive ? 'active' : ''}`}
                onClick={() => setCurrentStepId(step.id)}
              >
                <span className="step-label">{step.label}</span>
              </button>
            );
          })}
        </div>

        <div className="forecast-slider-wrap">
          <input
            type="range"
            min="0"
            max={TIMELINE_STEPS.length - 1}
            value={currentStepIndex < 0 ? 0 : currentStepIndex}
            onChange={(e) => {
              const idx = parseInt(e.target.value, 10);
              if (TIMELINE_STEPS[idx]) {
                setCurrentStepId(TIMELINE_STEPS[idx].id);
              }
            }}
            className="gov-range-slider"
          />
        </div>
      </div>
    </footer>
  );
}
