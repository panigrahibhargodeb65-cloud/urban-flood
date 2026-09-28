import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { X, CheckCircle2 } from 'lucide-react';

export default function ReportFloodModal({ isOpen, onClose, setActiveNav }) {
  const { submitCitizenReport } = useApp();
  const [step, setStep] = useState(1);
  const [location, setLocation] = useState('Khetrajpur Station Road Junction');
  const [depthText, setDepthText] = useState('20–50 cm');
  const [category, setCategory] = useState('Road flooding');
  const [hasPhoto, setHasPhoto] = useState(false);
  const [description, setDescription] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    submitCitizenReport({
      location,
      depthText,
      category,
      description,
    });
    setIsSubmitted(true);
  };

  const handleClose = () => {
    setIsSubmitted(false);
    setStep(1);
    onClose();
  };

  const handleTrackStatus = () => {
    handleClose();
    if (setActiveNav) setActiveNav('reportStatus');
  };

  return (
    <div className="gov-modal-backdrop" onClick={handleClose}>
      <div className="gov-modal-box report-modal-box" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header-row">
          <h3 className="modal-title">Report Flood Incident</h3>
          <button className="gov-modal-close" onClick={handleClose} aria-label="Close">
            <X size={18} />
          </button>
        </div>

        <div className="modal-body-content">
          {isSubmitted ? (
            <div className="gov-success-confirmation">
              <CheckCircle2 size={36} className="text-safe icon-centered" />
              <h4 className="confirmation-title">Report submitted successfully.</h4>
              <p className="confirmation-text">
                Your report has been logged with emergency operations and assigned an ID.
              </p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '16px', justifyContent: 'center' }}>
                <button className="gov-btn-secondary" onClick={handleClose}>
                  Close
                </button>
                <button className="gov-btn-primary" onClick={handleTrackStatus}>
                  Track Report Status →
                </button>
              </div>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="report-wizard-form">
              {/* Wizard Step Indicator */}
              <div className="wizard-steps-strip">
                <span className={`step-pill ${step >= 1 ? 'active' : ''}`}>1. Location</span>
                <span className={`step-pill ${step >= 2 ? 'active' : ''}`}>2. Depth</span>
                <span className={`step-pill ${step >= 3 ? 'active' : ''}`}>3. Category</span>
                <span className={`step-pill ${step >= 4 ? 'active' : ''}`}>4. Photo &amp; Details</span>
              </div>

              {/* Step 1: Location */}
              {step === 1 && (
                <div className="wizard-step-panel">
                  <label className="gov-form-label">Step 1: Location</label>
                  <input
                    type="text"
                    className="gov-form-input"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    placeholder="Enter location name"
                    required
                  />
                  <button
                    type="button"
                    className="gov-btn-secondary btn-sm"
                    style={{ marginTop: '8px' }}
                    onClick={() => setLocation('Current Location (Khetrajpur Station Road Junction)')}
                  >
                    Use current location
                  </button>

                  <div className="wizard-nav-actions">
                    <button
                      type="button"
                      className="gov-btn-primary full-width"
                      onClick={() => setStep(2)}
                    >
                      Next: Water Depth →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 2: Water Depth */}
              {step === 2 && (
                <div className="wizard-step-panel">
                  <label className="gov-form-label">Step 2: Water depth</label>
                  <div className="depth-options-vertical">
                    {[
                      'Less than 20 cm',
                      '20–50 cm',
                      '50–100 cm',
                      'More than 1 m',
                    ].map((d) => (
                      <button
                        key={d}
                        type="button"
                        className={`gov-option-btn ${depthText === d ? 'selected' : ''}`}
                        onClick={() => setDepthText(d)}
                      >
                        {depthText === d ? '● ' : '○ '}{d}
                      </button>
                    ))}
                  </div>

                  <div className="wizard-nav-actions">
                    <button
                      type="button"
                      className="gov-btn-secondary"
                      onClick={() => setStep(1)}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="gov-btn-primary"
                      onClick={() => setStep(3)}
                    >
                      Next: Category →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 3: Category */}
              {step === 3 && (
                <div className="wizard-step-panel">
                  <label className="gov-form-label">Step 3: Category</label>
                  <div className="depth-options-vertical">
                    {[
                      'Waterlogging',
                      'Road flooding',
                      'Drainage issue',
                      'Other',
                    ].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        className={`gov-option-btn ${category === cat ? 'selected' : ''}`}
                        onClick={() => setCategory(cat)}
                      >
                        {category === cat ? '● ' : '○ '}{cat}
                      </button>
                    ))}
                  </div>

                  <div className="wizard-nav-actions">
                    <button
                      type="button"
                      className="gov-btn-secondary"
                      onClick={() => setStep(2)}
                    >
                      ← Back
                    </button>
                    <button
                      type="button"
                      className="gov-btn-primary"
                      onClick={() => setStep(4)}
                    >
                      Next: Photo &amp; Submit →
                    </button>
                  </div>
                </div>
              )}

              {/* Step 4: Photo & Description */}
              {step === 4 && (
                <div className="wizard-step-panel">
                  <label className="gov-form-label">Step 4: Photo &amp; Description</label>

                  <div className="form-field">
                    <label className="gov-form-label">Upload photo (Optional)</label>
                    <button
                      type="button"
                      className={`gov-photo-btn ${hasPhoto ? 'attached' : ''}`}
                      onClick={() => setHasPhoto(!hasPhoto)}
                    >
                      {hasPhoto ? 'Photo Attached (field_photo.jpg)' : 'Attach Field Photo'}
                    </button>
                  </div>

                  <div className="form-field">
                    <label className="gov-form-label">Description (Optional)</label>
                    <textarea
                      className="gov-form-textarea"
                      rows="2"
                      placeholder="Enter additional details..."
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                    />
                  </div>

                  <div className="wizard-nav-actions">
                    <button
                      type="button"
                      className="gov-btn-secondary"
                      onClick={() => setStep(3)}
                    >
                      ← Back
                    </button>
                    <button type="submit" className="gov-btn-primary">
                      Submit Report
                    </button>
                  </div>
                </div>
              )}
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
