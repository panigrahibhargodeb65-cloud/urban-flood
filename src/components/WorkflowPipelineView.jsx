import React, { useState } from 'react';
import {
  Activity,
  Layers,
  Cpu,
  ShieldCheck,
  AlertTriangle,
  Compass,
  CheckCircle2,
  RefreshCw,
  GitMerge,
  Droplets,
  CloudRain,
  MapPin,
  Flame,
  ArrowRight,
  Database,
  Building,
  Zap,
} from 'lucide-react';

export default function WorkflowPipelineView() {
  const [activeStep, setActiveStep] = useState(8); // Default to Step 8: Produce flood state

  const steps = [
    {
      step: 1,
      name: 'Observe the city',
      short: 'Observe',
      icon: CloudRain,
      category: 'DATA FUSION',
      description: 'Receive weather/radar, rain gauges, IoT sensors, GIS, DEM terrain, water-level telemetry, and citizen/field observations.',
      details: 'Inputs carry source provenance, timestamp, freshness, and confidence. Quality checks run before model ingestion.',
      badge: 'Data Fusion & QC',
    },
    {
      step: 2,
      name: 'Build digital city',
      short: 'Digital Twin',
      icon: Building,
      category: 'CITY DOMAIN',
      description: 'DEM surface computational cells model elevation & runoff routes. GIS layers define roads, buildings, and drainage pipes.',
      details: 'Connected 2D computational cells allow water movement high → low terrain. Underground pipes & junctions form 1D network graph.',
      badge: 'GIS + DEM Grid',
    },
    {
      step: 3,
      name: 'Rainfall → runoff',
      short: 'Rain to Runoff',
      icon: Droplets,
      category: 'HYDROLOGY',
      description: 'Rainfall & 0-3h nowcast forcing is converted into catchment runoff.',
      details: 'Rainfall intensity acts as input forcing to hydraulic system, not the final flood output.',
      badge: 'Catchment Forcing',
    },
    {
      step: 4,
      name: 'Simulate drainage (1D)',
      short: '1D Drainage',
      icon: GitMerge,
      category: 'HYDRAULICS',
      description: '1D SWMM drainage model represents underground pipes, junctions, manholes, and outfalls.',
      details: 'Tracks pipe dimensions, slope roughness, system capacity, and surcharge conditions when full.',
      badge: 'SWMM 1D Network',
    },
    {
      step: 5,
      name: 'Simulate surface flow (2D)',
      short: '2D Surface',
      icon: Layers,
      category: 'HYDRAULICS',
      description: '2D surface model routes overland water over terrain computational cells.',
      details: 'Elevation, slope, surface roughness, and urban obstacle drag dictate surface flow and ponding depth.',
      badge: '2D Shallow Water',
    },
    {
      step: 6,
      name: 'Couple both domains (1D↔2D)',
      short: '1D↔2D Coupling',
      icon: RefreshCw,
      category: 'COUPLING',
      description: 'Bidirectional exchange: surface → drainage through inlets, and overloaded drainage → surface via surcharge.',
      details: 'Captures full interaction between street-level water and underground municipal storm sewer infrastructure.',
      badge: 'Bidirectional Exchange',
    },
    {
      step: 7,
      name: 'Represent urban effects',
      short: 'Urban Drag',
      icon: AlertTriangle,
      category: 'SYNTHETIC PROVENANCE',
      description: 'Dynamic inlet clogging reduces intake capacity; urban obstacle/form drag alters surface flow resistance.',
      details: 'Explicitly labels synthetic assumptions where verified municipal geometry is unavailable.',
      badge: 'Synthetic Labelled',
    },
    {
      step: 8,
      name: 'Produce flood state (0-3h)',
      short: 'Flood State',
      icon: Activity,
      category: 'NOWCAST ENGINE',
      description: 'Calculates 0-3 hour flood depth (cm), inundation extent, onset time (min), and expected duration (min).',
      details: 'Internal hydraulic/ML calculations run in metres; user-facing presentation is strictly formatted in centimetres.',
      badge: 'Centimetre Nowcast',
    },
    {
      step: 9,
      name: 'Convert water to road risk',
      short: 'Road Risk',
      icon: Compass,
      category: 'RISK MAPPING',
      description: 'Translates forecast water depths into road risk categories: SAFE, CAUTION, HIGH_RISK, and CRITICAL.',
      details: 'Connects hydraulic depth to transport corridor disruption thresholds across municipal road network.',
      badge: 'SAFE / CAUTION / HIGH / CRITICAL',
    },
    {
      step: 10,
      name: 'Identify hotspots & incidents',
      short: 'Hotspots & Incidents',
      icon: Flame,
      category: 'OPERATIONAL AI',
      description: 'Spatial clusters of severe flooding generate operational hotspots (#01-#06) and incident priorities (P1, P2, P3).',
      details: 'Citizen reports remain evidence to verify predictions and do not directly overwrite physics state.',
      badge: 'P1 / P2 / P3 Priorities',
    },
    {
      step: 11,
      name: 'Response & risk-aware routing',
      short: 'Risk Routing',
      icon: ShieldCheck,
      category: 'DECISION LAYER',
      description: 'Prioritizes emergency attention and calculates risk-aware routing penalizing/blocking unsafe corridors.',
      details: 'Searches for safe alternative bypass paths (e.g. Bareipali Bypass). Risk-aware, not a guarantee of 100% safety.',
      badge: 'Risk-Aware Routing',
    },
    {
      step: 12,
      name: 'Verify and continue',
      short: 'Verify & Learn',
      icon: CheckCircle2,
      category: 'FEEDBACK LOOP',
      description: 'Sensor telemetry, responder feedback, and citizen field reports verify nowcast accuracy.',
      details: 'Closes signature loop: Predict → Observe → Act → Verify → Resolve → Learn.',
      badge: 'Signature Loop Closed',
    },
  ];

  const currentStepData = steps.find((s) => s.step === activeStep) || steps[7];

  return (
    <div className="gov-workflow-page-container" style={{ padding: '20px', maxWidth: '1400px', margin: '0 auto' }}>
      {/* ------------------------------------------------------------- */}
      {/* CONCEPT BANNER & SIGNATURE LOOP */}
      {/* ------------------------------------------------------------- */}
      <div style={{ background: 'linear-gradient(135deg, #0F172A 0%, #1E293B 100%)', borderRadius: '8px', padding: '24px', color: '#FFFFFF', marginBottom: '24px', boxShadow: '0 10px 25px rgba(0,0,0,0.2)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '16px' }}>
          <div>
            <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#0284C7', color: '#FFFFFF', padding: '4px 10px', borderRadius: '4px', fontSize: '11px', fontWeight: 800, textTransform: 'uppercase', letterSpacing: '0.5px', marginBottom: '8px' }}>
              <Zap size={14} /> SIH 2026 Core Product Workflow
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: 800, margin: '4px 0 8px 0', letterSpacing: '-0.5px' }}>
              Urban Flood Nowcasting + Response Intelligence
            </h1>
            <p style={{ fontSize: '14px', color: '#94A3B8', margin: 0, maxWidth: '850px', lineHeight: '1.5' }}>
              <strong>Core idea:</strong> Don’t just show where water is. Predict how flooding evolves over 0–3 hours, understand why it happens through coupled 1D/2D physics, and turn prediction into street-level action.
            </p>
          </div>

          <div style={{ background: '#1E293B', border: '1px solid #334155', borderRadius: '6px', padding: '12px 16px', textAlign: 'right' }}>
            <span style={{ fontSize: '11px', color: '#38BDF8', fontWeight: 700, display: 'block', marginBottom: '2px' }}>AUTHORITATIVE MODEL</span>
            <strong style={{ fontSize: '13px', color: '#F8FAFC' }}>Physics 1D/2D + AI Augmentation</strong>
          </div>
        </div>

        {/* Signature Loop Bar */}
        <div style={{ marginTop: '20px', pt: '16px', borderTop: '1px solid #334155' }}>
          <div style={{ fontSize: '11px', fontWeight: 700, color: '#38BDF8', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '10px' }}>
            🔄 Signature Operational Loop
          </div>
          <div style={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: '8px' }}>
            {['OBSERVE', 'PREDICT', 'UNDERSTAND', 'PRIORITIZE', 'ACT', 'VERIFY', 'LEARN'].map((loopItem, idx) => (
              <React.Fragment key={loopItem}>
                <span
                  style={{
                    background: idx === 1 ? '#0284C7' : '#0F172A',
                    border: idx === 1 ? '1px solid #38BDF8' : '1px solid #334155',
                    color: '#FFFFFF',
                    padding: '6px 14px',
                    borderRadius: '20px',
                    fontSize: '12px',
                    fontWeight: 800,
                    letterSpacing: '0.5px',
                    boxShadow: idx === 1 ? '0 0 10px rgba(56, 189, 248, 0.4)' : 'none',
                  }}
                >
                  {loopItem}
                </span>
                {idx < 6 && <ArrowRight size={14} style={{ color: '#64748B' }} />}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 12-STEP INTERACTIVE ARCHITECTURE PIPELINE TRACKER */}
      {/* ------------------------------------------------------------- */}
      <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '24px', boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <div>
            <h2 style={{ fontSize: '18px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              12-Step Cause-and-Consequence Pipeline
            </h2>
            <p style={{ fontSize: '12px', color: '#64748B', margin: '2px 0 0 0' }}>
              Click any step below to inspect its computational role in the flood nowcasting &amp; response engine.
            </p>
          </div>
          <span style={{ fontSize: '12px', fontWeight: 700, color: '#0284C7', background: '#E0F2FE', padding: '4px 10px', borderRadius: '12px' }}>
            Active Step: {currentStepData.step} / 12 — {currentStepData.name}
          </span>
        </div>

        {/* Step Buttons Track */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(100px, 1fr))', gap: '8px', marginBottom: '20px' }}>
          {steps.map((s) => {
            const isActive = s.step === activeStep;
            return (
              <button
                key={s.step}
                onClick={() => setActiveStep(s.step)}
                style={{
                  background: isActive ? '#0F172A' : '#F8FAFC',
                  color: isActive ? '#FFFFFF' : '#334155',
                  border: isActive ? '2px solid #0284C7' : '1px solid #E2E8F0',
                  borderRadius: '6px',
                  padding: '10px 6px',
                  cursor: 'pointer',
                  textAlign: 'center',
                  transition: 'all 0.2s ease',
                  boxShadow: isActive ? '0 4px 12px rgba(2, 132, 199, 0.25)' : 'none',
                }}
              >
                <div style={{ fontSize: '10px', fontWeight: 800, color: isActive ? '#38BDF8' : '#64748B', marginBottom: '2px' }}>
                  STEP {s.step}
                </div>
                <div style={{ fontSize: '11px', fontWeight: 700, lineHeight: '1.2' }}>{s.short}</div>
              </button>
            );
          })}
        </div>

        {/* Selected Step Detailed Card */}
        <div style={{ background: '#F8FAFC', border: '1px solid #CBD5E1', borderRadius: '8px', padding: '20px', display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '20px', alignItems: 'center' }}>
          <div style={{ background: '#FFFFFF', padding: '16px', borderRadius: '6px', border: '1px solid #E2E8F0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '10px' }}>
              <div style={{ background: '#E0F2FE', color: '#0284C7', padding: '8px', borderRadius: '8px' }}>
                <currentStepData.icon size={24} />
              </div>
              <div>
                <span style={{ fontSize: '10px', fontWeight: 800, color: '#0284C7', textTransform: 'uppercase' }}>{currentStepData.category}</span>
                <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>Step {currentStepData.step} — {currentStepData.name}</h3>
              </div>
            </div>
            <span className="status-tag" style={{ background: '#0F172A', color: '#38BDF8', fontWeight: 700, fontSize: '11px', padding: '3px 8px', borderRadius: '4px' }}>
              {currentStepData.badge}
            </span>
          </div>

          <div>
            <p style={{ fontSize: '14px', fontWeight: 600, color: '#1E293B', marginTop: 0, marginBottom: '8px' }}>
              {currentStepData.description}
            </p>
            <p style={{ fontSize: '13px', color: '#475569', margin: 0, lineHeight: '1.5', background: '#FFFFFF', padding: '10px 14px', borderRadius: '6px', borderLeft: '4px solid #0284C7' }}>
              <strong>Operational Mechanism:</strong> {currentStepData.details}
            </p>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* 2-COLUMN GRID: PHYSICS+AI SAFETY GATES & DEGRADED MODE */}
      {/* ------------------------------------------------------------- */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '24px', marginBottom: '24px' }}>
        {/* Left Card: Physics + AI Core Architecture */}
        <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', pb: '10px' }}>
            <Cpu size={20} style={{ color: '#0284C7' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              6. Physics + AI Integration Foundation
            </h3>
          </div>

          <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', marginBottom: '14px' }}>
            Physics is the authoritative foundation. AI/ML (Compact 2D U-Net) augments rapid candidate predictions and nowcasting.
          </p>

          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '6px', padding: '12px', marginBottom: '14px' }}>
            <strong style={{ fontSize: '12px', color: '#1E40AF', display: 'block', marginBottom: '4px' }}>
              💡 Simple Explanation
            </strong>
            <span style={{ fontSize: '13px', color: '#1E3A8A', fontWeight: 700 }}>
              “AI proposes the fast answer; physics and safety gates decide whether it can be trusted.”
            </span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
              <span>OOD (Out-Of-Distribution) Check:</span>
              <strong style={{ color: '#15803D' }}>● NOMINAL (Passed)</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
              <span>Physics Safety Gate:</span>
              <strong style={{ color: '#0284C7' }}>● AUTHORITATIVE</strong>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', padding: '8px 12px', background: '#F8FAFC', borderRadius: '4px', fontSize: '12px' }}>
              <span>ML Candidate Acceleration:</span>
              <strong style={{ color: '#7C3AED' }}>2D U-Net Candidate Accepted</strong>
            </div>
          </div>
        </div>

        {/* Right Card: Missing Data & Degraded Mode Strategy */}
        <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '20px' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '14px', borderBottom: '1px solid #F1F5F9', pb: '10px' }}>
            <ShieldCheck size={20} style={{ color: '#D97706' }} />
            <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', margin: 0 }}>
              7. Missing Data &amp; Degraded Mode Operating Strategy
            </h3>
          </div>

          <p style={{ fontSize: '13px', color: '#334155', lineHeight: '1.5', marginBottom: '14px' }}>
            A deployment-ready system cannot assume every sensor is always available. Freshness and quality checks support degraded operations seamlessly.
          </p>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
            <div style={{ padding: '8px 12px', background: '#FEF3C7', borderLeft: '4px solid #D97706', borderRadius: '4px', fontSize: '12px' }}>
              <strong style={{ color: '#92400E', display: 'block' }}>Missing / Malformed Rainfall:</strong>
              <span style={{ color: '#78350F' }}>System enters Degraded Mode; uses default radar historical forcing.</span>
            </div>

            <div style={{ padding: '8px 12px', background: '#F0FDF4', borderLeft: '4px solid #16A34A', borderRadius: '4px', fontSize: '12px' }}>
              <strong style={{ color: '#166534', display: 'block' }}>ML Divergence or OOD Failure:</strong>
              <span style={{ color: '#14532D' }}>System immediately falls back to authoritative physics-only solver.</span>
            </div>

            <div style={{ padding: '8px 12px', background: '#F1F5F9', borderLeft: '4px solid #64748B', borderRadius: '4px', fontSize: '12px' }}>
              <strong style={{ color: '#334155', display: 'block' }}>Synthetic Data Provenance:</strong>
              <span style={{ color: '#475569' }}>Synthetic topography &amp; inlet assumptions remain explicitly labelled.</span>
            </div>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      {/* SECTION 11: WHAT WE SHOULD CLAIM VS WHAT WE AVOID */}
      {/* ------------------------------------------------------------- */}
      <div style={{ background: '#FFFFFF', borderRadius: '8px', border: '1px solid #E2E8F0', padding: '20px', marginBottom: '24px' }}>
        <h3 style={{ fontSize: '16px', fontWeight: 800, color: '#0F172A', marginTop: 0, marginBottom: '14px' }}>
          11. Engineering Claims &amp; Verification Matrix
        </h3>

        <div style={{ overflowX: 'auto' }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '13px' }}>
            <thead>
              <tr style={{ background: '#F8FAFC', borderBottom: '2px solid #E2E8F0', textAlign: 'left' }}>
                <th style={{ padding: '10px 14px', color: '#1E293B', width: '50%' }}>✅ What We Should Claim</th>
                <th style={{ padding: '10px 14px', color: '#1E293B', width: '50%' }}>❌ What We Avoid Claiming</th>
              </tr>
            </thead>
            <tbody>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '10px 14px', color: '#15803D', fontWeight: 600 }}>Physics-first, AI-augmented architecture.</td>
                <td style={{ padding: '10px 14px', color: '#B91C1C' }}>AI predicts everything automatically without physics.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <td style={{ padding: '10px 14px', color: '#15803D', fontWeight: 600 }}>Supports 0–3 hour street-level flood nowcasting.</td>
                <td style={{ padding: '10px 14px', color: '#B91C1C' }}>100% accurate flood prediction.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #E2E8F0' }}>
                <td style={{ padding: '10px 14px', color: '#15803D', fontWeight: 600 }}>Risk-aware routing (penalizes high-risk roads).</td>
                <td style={{ padding: '10px 14px', color: '#B91C1C' }}>Guaranteed 100% safe routing.</td>
              </tr>
              <tr style={{ borderBottom: '1px solid #E2E8F0', background: '#F8FAFC' }}>
                <td style={{ padding: '10px 14px', color: '#15803D', fontWeight: 600 }}>Synthetic assumptions are explicitly labelled.</td>
                <td style={{ padding: '10px 14px', color: '#B91C1C' }}>Presenting synthetic data as real.</td>
              </tr>
              <tr>
                <td style={{ padding: '10px 14px', color: '#15803D', fontWeight: 600 }}>Observations verify and inform prediction loop.</td>
                <td style={{ padding: '10px 14px', color: '#B91C1C' }}>Allowing unverified reports to rewrite hydraulic state directly.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
