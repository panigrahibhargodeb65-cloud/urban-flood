import React from 'react';
import logoImg from '../assets/logo.png';

export default function Footer() {
  return (
    <footer className="gov-footer">
      <div className="gov-footer-content">
        <div className="gov-footer-branding">
          <img src={logoImg} alt="Urban Flood Intelligence Logo" className="footer-logo-img" />
          <div className="footer-brand-text">
            <span className="gov-footer-title">Urban Flood Intelligence System</span>
            <span className="gov-footer-subtitle">
              Smart India Hackathon • Problem Statement 26085
            </span>
          </div>
        </div>
        <p className="gov-footer-disclaimer">
          Prototype / Demonstration System — Prepared for SIH 26085 Evaluation
        </p>
        <nav className="gov-footer-links" aria-label="Footer Navigation">
          <a href="#help" onClick={(e) => { e.preventDefault(); alert('Help Desk: Emergency helpline 1077 / Municipal Control Room 1800-XXX-XXXX.'); }}>
            Help
          </a>
          <span className="footer-sep">|</span>
          <a href="#accessibility" onClick={(e) => { e.preventDefault(); alert('Accessibility: Portal conforms to W3C WCAG 2.1 AA standards for public service.'); }}>
            Accessibility
          </a>
          <span className="footer-sep">|</span>
          <a href="#contact" onClick={(e) => { e.preventDefault(); alert('Contact: Urban Flood Emergency Response Cell, Municipal Administration.'); }}>
            Contact
          </a>
          <span className="footer-sep">|</span>
          <a href="#privacy" onClick={(e) => { e.preventDefault(); alert('Privacy Policy: Public data portal for emergency response demonstration.'); }}>
            Privacy
          </a>
        </nav>
      </div>
    </footer>
  );
}
