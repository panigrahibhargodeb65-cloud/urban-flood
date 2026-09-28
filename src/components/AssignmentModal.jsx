import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X } from 'lucide-react';

export default function AssignmentModal({ hotspot, isOpen, onClose }) {
  const { assignResponseTeam, incidents } = useApp();
  const [team, setTeam] = useState('NDRF');
  const [priority, setPriority] = useState('Critical');

  if (!isOpen || !hotspot) return null;

  const linkedInc = incidents.find((i) => i.hotspotId === hotspot.id) || incidents[0];

  const handleSubmit = (e) => {
    e.preventDefault();
    assignResponseTeam(linkedInc.id, team, priority);
    onClose();
  };

  return (
    <div className="gov-modal-backdrop" onClick={onClose}>
      <div className="gov-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">Assign Response Team</h3>
          <button className="gov-modal-close" onClick={onClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-content">
          <div className="target-summary-box">
            <span className="d-label">Target Location:</span>
            <strong className="d-val">{hotspot.name}</strong>
          </div>

          <form onSubmit={handleSubmit} className="gov-assign-form">
            <div className="form-field">
              <label className="gov-form-label">Select Team</label>
              <select
                className="gov-form-select"
                value={team}
                onChange={(e) => setTeam(e.target.value)}
              >
                <option value="NDRF">NDRF</option>
                <option value="Municipal Task Force">Municipal Task Force</option>
                <option value="Traffic Police">Traffic Police</option>
                <option value="Fire & Rescue">Fire &amp; Rescue</option>
              </select>
            </div>

            <div className="form-field">
              <label className="gov-form-label">Select Priority</label>
              <select
                className="gov-form-select"
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
              >
                <option value="Critical">Critical</option>
                <option value="High">High</option>
                <option value="Moderate">Moderate</option>
              </select>
            </div>

            <div className="modal-actions-row">
              <button type="button" className="gov-btn-secondary" onClick={onClose}>
                Cancel
              </button>
              <button type="submit" className="gov-btn-primary">
                Assign Team
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
