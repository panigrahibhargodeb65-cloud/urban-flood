import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  INITIAL_HOTSPOTS,
  INITIAL_INCIDENTS,
  INITIAL_CITIZEN_REPORTS,
  INITIAL_ASSETS,
  INITIAL_PROFESSOR_COMPLAINTS,
  INITIAL_NOTIFICATIONS,
} from '../data/centralData';

const AppContext = createContext(null);

const AUTH_STORAGE_KEY = 'sih_urban_flood_auth_session';

export function AppProvider({ children }) {
  // Session Authentication State (Persists on refresh)
  const [auth, setAuth] = useState(() => {
    try {
      const savedAuth = sessionStorage.getItem(AUTH_STORAGE_KEY);
      if (savedAuth) {
        const parsed = JSON.parse(savedAuth);
        if (parsed && parsed.isAuthenticated && parsed.role) {
          return parsed;
        }
      }
    } catch (e) {
      console.warn('Failed to restore auth session from storage', e);
    }
    return {
      isAuthenticated: false,
      role: null, // 'government' | 'admin' | 'citizen'
      user: null,
    };
  });

  const [hotspots, setHotspots] = useState(INITIAL_HOTSPOTS);
  const [incidents, setIncidents] = useState(INITIAL_INCIDENTS);
  const [citizenReports, setCitizenReports] = useState(INITIAL_CITIZEN_REPORTS);
  const [assetsList, setAssetsList] = useState(INITIAL_ASSETS);
  const [professorComplaints, setProfessorComplaints] = useState(INITIAL_PROFESSOR_COMPLAINTS);
  const [notifications, setNotifications] = useState(INITIAL_NOTIFICATIONS);
  
  const [currentStepId, setCurrentStepId] = useState('now');
  const [selectedHotspotId, setSelectedHotspotId] = useState('station-road');
  const [selectedIncidentId, setSelectedIncidentId] = useState(null);

  const selectedIncident = selectedIncidentId
    ? incidents.find((i) => i.id === selectedIncidentId) || null
    : null;

  const setSelectedIncident = (inc) => {
    if (!inc) {
      setSelectedIncidentId(null);
    } else if (typeof inc === 'string') {
      setSelectedIncidentId(inc);
    } else {
      setSelectedIncidentId(inc.id);
    }
  };

  const [activeModal, setActiveModal] = useState(null); // null | 'details' | 'assign' | 'safeRoute' | 'reportFlood'
  const [toastMessage, setToastMessage] = useState(null);

  // Sync auth state to sessionStorage whenever it changes
  useEffect(() => {
    try {
      if (auth.isAuthenticated) {
        sessionStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(auth));
      } else {
        sessionStorage.removeItem(AUTH_STORAGE_KEY);
      }
    } catch (e) {
      console.warn('Failed to save auth session to storage', e);
    }
  }, [auth]);

  const selectedHotspot =
    hotspots.find((h) => h.id === selectedHotspotId) || hotspots[0];

  const showToast = (msg) => {
    setToastMessage(msg);
  };

  // Login action: Locks role for the entire session
  const login = (role) => {
    let title = 'Government Officer';
    let name = 'Cmdr. V. Sharma';

    if (role === 'admin') {
      title = 'Administrator';
      name = 'Ops Control Room';
    } else if (role === 'citizen') {
      title = 'Citizen';
      name = 'Sambalpur Resident';
    }

    setAuth({
      isAuthenticated: true,
      role: role,
      user: {
        title,
        name,
      },
    });
  };

  // Logout action: Clears auth session completely and returns to login
  const logout = () => {
    setAuth({
      isAuthenticated: false,
      role: null,
      user: null,
    });
    sessionStorage.removeItem(AUTH_STORAGE_KEY);
  };

  const selectHotspot = (id) => {
    setSelectedHotspotId(id);
  };

  const setForecastStep = (stepId) => {
    setCurrentStepId(stepId);
  };

  // Create Incident (Supports custom location strings or hotspot objects & generates map pin)
  const createIncident = (hotspotOrLocation) => {
    let hotspot;
    let targetLoc = 'Khetrajpur Station Road Junction';

    if (typeof hotspotOrLocation === 'string') {
      targetLoc = hotspotOrLocation;
      hotspot = ensureHotspotExists(targetLoc);
    } else if (hotspotOrLocation && (hotspotOrLocation.name || hotspotOrLocation.location)) {
      targetLoc = hotspotOrLocation.name || hotspotOrLocation.location;
      hotspot = ensureHotspotExists(targetLoc, hotspotOrLocation.lat, hotspotOrLocation.lng);
    } else {
      hotspot = hotspots[0];
      targetLoc = hotspot.name;
    }

    const maxIncNum = incidents.reduce((max, inc) => {
      const num = parseInt((inc.id || '').replace(/\D/g, ''), 10) || 2600;
      return num > max ? num : max;
    }, 2600);
    const newIncId = `INC-${maxIncNum + 1}`;

    const newIncident = {
      id: newIncId,
      location: targetLoc,
      hotspotId: hotspot.id,
      severity: hotspotOrLocation?.severity || (hotspot.timelineData && hotspot.timelineData[currentStepId]?.severity) || hotspot.basePriority || 'HIGH',
      source: auth.role === 'admin' ? 'System Administrator' : 'Government Officer',
      time: 'Just now',
      status: 'REPORTED',
      assignedTeam: 'Unassigned',
      notes: hotspotOrLocation?.notes || `Emergency incident lodged for ${targetLoc}.`,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    showToast(`Emergency Incident #${newIncId} created for ${targetLoc} & mapped to GIS!`);
    return newIncident;
  };

  // Validate Incident (Admin workflow)
  const validateIncident = (incidentId) => {
    updateIncidentStatus(incidentId, 'VALIDATED');
  };

  // Assign Team (Admin or Government)
  const assignResponseTeam = (incidentId, teamName, priority) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId
          ? { ...inc, status: 'ASSIGNED', assignedTeam: teamName }
          : inc
      )
    );

    const targetInc = incidents.find((i) => i.id === incidentId);
    if (targetInc) {
      if (targetInc.hotspotId) {
        setHotspots((prev) =>
          prev.map((h) =>
            h.id === targetInc.hotspotId ? { ...h, incidentStatus: 'ASSIGNED' } : h
          )
        );
      }
      setCitizenReports((prev) =>
        prev.map((rep) => {
          if (
            (targetInc.reportId && rep.id === targetInc.reportId) ||
            (rep.location && targetInc.location && (
              rep.location.toLowerCase().includes(targetInc.location.toLowerCase()) ||
              targetInc.location.toLowerCase().includes(rep.location.toLowerCase())
            ))
          ) {
            return { ...rep, status: 'ASSIGNED' };
          }
          return rep;
        })
      );
    }

    showToast(`${teamName} dispatched to ${targetInc?.location || 'Location'} (${priority} Priority).`);
  };

  // AI Assist Recommendation Auto-dispatch
  const applyAiRecommendation = (incidentId, recommendedTeam, recommendedPriority) => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'ASSIGNED',
            assignedTeam: recommendedTeam,
            severity: recommendedPriority || inc.severity,
          };
        }
        return inc;
      })
    );

    const targetInc = incidents.find((i) => i.id === incidentId);
    if (targetInc) {
      if (targetInc.hotspotId) {
        setHotspots((prev) =>
          prev.map((h) =>
            h.id === targetInc.hotspotId ? { ...h, incidentStatus: 'ASSIGNED' } : h
          )
        );
      }
      setCitizenReports((prev) =>
        prev.map((rep) => {
          if (
            (targetInc.reportId && rep.id === targetInc.reportId) ||
            (rep.location && targetInc.location && (
              rep.location.toLowerCase().includes(targetInc.location.toLowerCase()) ||
              targetInc.location.toLowerCase().includes(rep.location.toLowerCase())
            ))
          ) {
            return { ...rep, status: 'ASSIGNED' };
          }
          return rep;
        })
      );
    }

    showToast(`AI Assist: Dispatched ${recommendedTeam} to ${targetInc?.location || 'Location'} (${recommendedPriority} Priority).`);
  };

  // Update Incident Status (Synchronizes across Incidents, Hotspots, and Citizen Reports)
  const updateIncidentStatus = (incidentId, newStatus) => {
    setIncidents((prev) =>
      prev.map((inc) =>
        inc.id === incidentId ? { ...inc, status: newStatus } : inc
      )
    );

    const targetInc = incidents.find((i) => i.id === incidentId);
    if (targetInc) {
      if (targetInc.hotspotId) {
        setHotspots((prev) =>
          prev.map((h) =>
            h.id === targetInc.hotspotId ? { ...h, incidentStatus: newStatus } : h
          )
        );
      }

      // Sync status to matching citizen report
      setCitizenReports((prev) =>
        prev.map((rep) => {
          if (
            (targetInc.reportId && rep.id === targetInc.reportId) ||
            (rep.location && targetInc.location && (
              rep.location.toLowerCase().includes(targetInc.location.toLowerCase()) ||
              targetInc.location.toLowerCase().includes(rep.location.toLowerCase())
            ))
          ) {
            return { ...rep, status: newStatus };
          }
          return rep;
        })
      );
    }

    showToast(`Incident #${incidentId} status updated to ${newStatus.replace('_', ' ')}.`);
  };

  // Helper to ensure any custom location name creates a Monitored Map Hotspot Pin
  const ensureHotspotExists = (locationName, latOverride, lngOverride) => {
    if (!locationName) return hotspots[0];

    const cleanLoc = locationName.trim();
    const existing = hotspots.find(
      (h) =>
        h.name.toLowerCase().includes(cleanLoc.toLowerCase()) ||
        cleanLoc.toLowerCase().includes(h.name.toLowerCase())
    );

    if (existing) return existing;

    // Generate new hotspot ID & coordinates near Sambalpur area
    const newId = `loc-${cleanLoc.toLowerCase().replace(/[^a-z0-9]/g, '-')}-${Date.now().toString().slice(-4)}`;
    const offsetLat = (Math.random() - 0.5) * 0.035;
    const offsetLng = (Math.random() - 0.5) * 0.035;
    const lat = latOverride || (21.475 + offsetLat);
    const lng = lngOverride || (83.972 + offsetLng);

    const newHotspot = {
      id: newId,
      name: cleanLoc,
      zone: 'Sambalpur Emergency Sector',
      lat: parseFloat(lat.toFixed(4)),
      lng: parseFloat(lng.toFixed(4)),
      riskScore: 82,
      basePriority: 'HIGH',
      incidentStatus: 'REPORTED',
      cause: 'Citizen Reported Waterlogging / Emergency Incident Point',
      timelineData: {
        now: { depth: 0.65, severity: 'HIGH', duration: 45, onset: 0 },
        '30m': { depth: 0.78, severity: 'CRITICAL', duration: 60, onset: 30 },
        '60m': { depth: 0.85, severity: 'CRITICAL', duration: 90, onset: 60 },
        '90m': { depth: 0.70, severity: 'HIGH', duration: 120, onset: 90 },
        '120m': { depth: 0.45, severity: 'MODERATE', duration: 150, onset: 120 },
        '180m': { depth: 0.20, severity: 'LOW', duration: 180, onset: 180 },
      },
      confidence: '94% Live Verified',
    };

    setHotspots((prev) => [newHotspot, ...prev]);
    return newHotspot;
  };

  // Escalate Incident to Command Level
  const escalateIncident = (incidentId, reason = 'Critical flood depth & high infrastructure threat') => {
    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.id === incidentId) {
          return {
            ...inc,
            status: 'ESCALATED',
            severity: 'CRITICAL',
            isEscalated: true,
            escalationReason: reason,
            assignedTeam: inc.assignedTeam === 'Unassigned' ? 'NDRF Battalion 4 & State Response Command' : `${inc.assignedTeam} + State Command Unit`,
            notes: `[🚨 ESCALATED COMMAND ALERT]: ${reason}. ${inc.notes || ''}`,
          };
        }
        return inc;
      })
    );

    const targetInc = incidents.find((i) => i.id === incidentId);
    if (targetInc) {
      if (targetInc.hotspotId) {
        setHotspots((prev) =>
          prev.map((h) =>
            h.id === targetInc.hotspotId ? { ...h, incidentStatus: 'ESCALATED' } : h
          )
        );
      }
      setCitizenReports((prev) =>
        prev.map((rep) => {
          if (
            (targetInc.reportId && rep.id === targetInc.reportId) ||
            (rep.location && targetInc.location && (
              rep.location.toLowerCase().includes(targetInc.location.toLowerCase()) ||
              targetInc.location.toLowerCase().includes(rep.location.toLowerCase())
            ))
          ) {
            return { ...rep, status: 'ESCALATED' };
          }
          return rep;
        })
      );
    }

    showToast(`🚨 CRITICAL COMMAND ALERT: Incident #${incidentId} escalated to NDRF & State Disaster Control!`);
  };

  // Submit Citizen Report (Creates linked incident & map hotspot with sequential IDs)
  const submitCitizenReport = ({ location, depthText, category, description }) => {
    const targetLoc = location || 'Khetrajpur Station Road Area';
    const matchedHotspot = ensureHotspotExists(targetLoc);

    // Generate sequential report ID based on highest existing number
    const maxRepNum = citizenReports.reduce((max, r) => {
      const num = parseInt((r.id || '').replace(/\D/g, ''), 10) || 800;
      return num > max ? num : max;
    }, 800);
    const repId = `REP-${maxRepNum + 1}`;

    const newReport = {
      id: repId,
      location: targetLoc,
      time: 'Just now',
      depthText: depthText || '20–50 cm',
      category: category || 'Road flooding',
      status: 'REPORTED',
      description: description || 'Water accumulation reported by citizen.',
      verifiedNote: 'Citizen report submitted to operations for validation.',
    };

    setCitizenReports((prev) => [newReport, ...prev]);

    // Generate sequential incident ID based on highest existing number
    const maxIncNum = incidents.reduce((max, inc) => {
      const num = parseInt((inc.id || '').replace(/\D/g, ''), 10) || 2600;
      return num > max ? num : max;
    }, 2600);
    const newIncId = `INC-${maxIncNum + 1}`;

    const isCritical = depthText && (depthText.includes('Waist') || depthText.includes('1 m') || depthText.includes('50–100'));

    const newIncident = {
      id: newIncId,
      location: targetLoc,
      hotspotId: matchedHotspot.id,
      severity: isCritical ? 'CRITICAL' : 'HIGH',
      source: 'Citizen Observation',
      time: 'Just now',
      status: 'REPORTED',
      assignedTeam: 'Unassigned',
      notes: `${category || 'Road Flooding'}: ${description || 'Water accumulation reported by citizen.'}`,
      reportId: repId,
    };

    setIncidents((prev) => [newIncident, ...prev]);
    showToast(`Flood report submitted! Linked to Ops Incident #${newIncId} and added to GIS Map.`);
  };

  // Purge/Delete Incident (Admin permission)
  const deleteIncident = (incidentId) => {
    setIncidents((prev) => prev.filter((inc) => inc.id !== incidentId));
    setCitizenReports((prev) => prev.filter((rep) => rep.incidentId !== incidentId && rep.id !== incidentId));
    if (selectedIncidentId === incidentId) setSelectedIncidentId(null);
    showToast(`Incident #${incidentId} purged from control room database.`);
  };

  // Toggle Asset Pump Deployment State
  const toggleAssetDeployment = (assetId) => {
    setAssetsList((prev) =>
      prev.map((ast) => {
        if (ast.id === assetId) {
          const nextState = !ast.isDeployed;
          const newStatus = nextState ? 'Dewatering Pump Deployed' : 'Emergency Fleet Standby';
          showToast(`${newStatus} at ${ast.name}.`);
          return { ...ast, isDeployed: nextState, status: newStatus };
        }
        return ast;
      })
    );
  };

  // Deploy Dewatering Pump at a NEW Point/Location
  const deployPumpAtNewPoint = ({ name, location, category, pumpCapacity, lat, lng }) => {
    const targetLoc = location || name || 'Khetrajpur Station Road Junction';
    const matchedHotspot = ensureHotspotExists(targetLoc, lat, lng);

    const maxAstNum = assetsList.reduce((max, a) => {
      const num = parseInt((a.id || '').replace(/\D/g, ''), 10) || 100;
      return num > max ? num : max;
    }, 100);

    const newAssetId = `AST-${maxAstNum + 1}`;
    const finalLat = lat || matchedHotspot.lat;
    const finalLng = lng || matchedHotspot.lng;

    const newAsset = {
      id: newAssetId,
      name: name || `Mobile Pump Unit (${targetLoc})`,
      category: category || 'Mobile Dewatering Unit',
      nearestHotspot: targetLoc,
      distance: '0.1 km (On Site)',
      vulnerability: 'HIGH',
      status: 'Dewatering Pump Deployed',
      isDeployed: true,
      lat: finalLat,
      lng: finalLng,
      pumpCapacity: pumpCapacity || '8,000 L/min Mobile Dewatering Unit',
    };

    setAssetsList((prev) => [newAsset, ...prev]);
    showToast(`Dewatering Pump #${newAssetId} deployed at ${newAsset.name} and mapped to GIS!`);
  };

  // Lodge Complaint Against Specific Professor / Institutional Nodal Officer (Govt Admin extra privilege)
  const lodgeProfessorComplaint = ({ professorName, department, institution, location, severity, description }) => {
    const maxProfId = professorComplaints.reduce((max, p) => {
      const num = parseInt((p.id || '').replace(/\D/g, ''), 10) || 100;
      return num > max ? num : max;
    }, 100);
    const newProfId = `PROF-CMP-${maxProfId + 1}`;

    const newComplaint = {
      id: newProfId,
      professorName: professorName || 'Dr. A.K. Panda',
      department: department || 'Department of Civil Engineering & Campus Nodal',
      institution: institution || 'VSSUT Burla / Institutional Drainage Cell',
      location: location || 'Campus Perimeter Drain Gate 3',
      severity: severity || 'CRITICAL',
      status: 'LODGED_WITH_STATE',
      date: 'Just now',
      loggedBy: auth?.user?.name || 'Govt Admin Officer',
      description: description || 'Failure to clear campus perimeter culvert causing storm overflow into main public boulevard.',
      escalatedToHigherAuthority: true,
      higherAuthorityNotes: 'Escalated to Higher Education Directorate & State Emergency Command for immediate administrative compliance order.',
    };

    setProfessorComplaints((prev) => [newComplaint, ...prev]);

    // Send high-priority system notification to Municipal Admin
    sendNotificationToMunicipalAdmin({
      title: `🚨 Official Professor Complaint Lodged: ${newComplaint.professorName}`,
      message: `Govt Officer ${newComplaint.loggedBy} lodged official institutional non-compliance complaint against ${newComplaint.professorName} (${newComplaint.department}). Escalated to Higher State Authority.`,
    });

    showToast(`Official Complaint #${newProfId} lodged against ${newComplaint.professorName} & Escalated to Higher Authority!`);
  };

  // Flag Unsolved Issue (Citizen workflow when issue is not resolved)
  const flagReportUnsolved = (reportId, citizenFeedback) => {
    setCitizenReports((prev) =>
      prev.map((rep) => {
        if (rep.id === reportId) {
          return {
            ...rep,
            status: 'UNSOLVED_BY_CITIZEN',
            citizenFeedback: citizenFeedback || 'Water remains deep and unmanaged after initial team assignment.',
            unsolvedFlagTime: 'Just now',
          };
        }
        return rep;
      })
    );

    setIncidents((prev) =>
      prev.map((inc) => {
        if (inc.reportId === reportId || inc.id === reportId) {
          return {
            ...inc,
            status: 'UNSOLVED_BY_CITIZEN',
            severity: 'CRITICAL',
            notes: `[⚠️ CITIZEN UNSOLVED ALERT]: ${citizenFeedback || 'Citizen flagged issue as still flooded!'} ${inc.notes || ''}`,
          };
        }
        return inc;
      })
    );

    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'CITIZEN_UNSOLVED',
      title: '⚠️ Citizen Flagged UNSOLVED Flood Issue!',
      message: `Citizen reported report #${reportId} is STILL flooded: "${citizenFeedback || 'Water unmanaged'}"`,
      time: 'Just now',
      sender: 'Citizen Portal',
      targetRole: 'government',
      reportId: reportId,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);

    showToast(`Unsolved Alert sent for Report #${reportId}! Government Admin notified for immediate addressing.`);
  };

  // Address Unsolved Report & Dispatch Notification to Municipal Admin (Govt Admin extra privilege)
  const addressUnsolvedReport = (reportId, govtActionText) => {
    setCitizenReports((prev) =>
      prev.map((rep) =>
        rep.id === reportId ? { ...rep, status: 'IN_PROGRESS', verifiedNote: `Govt Action: ${govtActionText || 'Heavy Dewatering Rig Dispatched'}` } : rep
      )
    );

    setIncidents((prev) =>
      prev.map((inc) =>
        inc.reportId === reportId || inc.id === reportId
          ? {
              ...inc,
              status: 'IN_PROGRESS',
              severity: 'CRITICAL',
              notes: `[Govt Direct Action]: ${govtActionText || 'Heavy Dewatering Rig Dispatched'}. ${inc.notes || ''}`,
            }
          : inc
      )
    );

    sendNotificationToMunicipalAdmin({
      title: `🔔 URGENT MUNICIPAL DIRECTIVE: Addressed Unsolved Report #${reportId}`,
      message: `Govt Admin Cmdr. V. Sharma addressed unsolved citizen issue #${reportId} with directive: "${govtActionText || 'Deploy High Capacity Dewatering Rig'}". Municipal task force dispatched.`,
      reportId,
    });

    showToast(`Unsolved Report #${reportId} addressed! Urgent notification sent to Municipal Admin & Task Force.`);
  };

  // Send Notification to Municipal Admin (Govt Admin extra privilege)
  const sendNotificationToMunicipalAdmin = ({ title, message, incidentId, reportId }) => {
    const newNotif = {
      id: `NOTIF-${Date.now().toString().slice(-4)}`,
      type: 'GOVT_TO_MUNICIPAL',
      title: title || '🔔 Urgent Municipal Alert from Govt Admin',
      message: message || 'Govt Admin dispatched an urgent municipal directive.',
      time: 'Just now',
      sender: auth?.user?.name || 'Govt Admin Officer',
      targetRole: 'admin',
      incidentId,
      reportId,
      read: false,
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Mark notification as read
  const markNotificationAsRead = (notifId) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === notifId ? { ...n, read: true } : n))
    );
  };

  return (
    <AppContext.Provider
      value={{
        auth,
        login,
        logout,
        hotspots,
        incidents,
        citizenReports,
        assetsList,
        professorComplaints,
        notifications,
        currentStepId,
        setForecastStep,
        selectedHotspotId,
        selectedHotspot,
        selectHotspot,
        selectedIncident,
        setSelectedIncident,
        activeModal,
        setActiveModal,
        toastMessage,
        setToastMessage,
        showToast,
        createIncident,
        validateIncident,
        assignResponseTeam,
        applyAiRecommendation,
        updateIncidentStatus,
        submitCitizenReport,
        deleteIncident,
        toggleAssetDeployment,
        deployPumpAtNewPoint,
        escalateIncident,
        ensureHotspotExists,
        lodgeProfessorComplaint,
        flagReportUnsolved,
        addressUnsolvedReport,
        sendNotificationToMunicipalAdmin,
        markNotificationAsRead,
      }}
    >
      {children}
    </AppContext.Provider>
  );
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
