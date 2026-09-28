import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import { useApp } from '../context/AppContext';
import {
  Layers,
  Navigation,
  Plus,
  Minus,
  Maximize2,
  Minimize2,
  ShieldAlert,
  AlertTriangle,
  Hospital,
  Flame,
  Shield,
  School,
  Activity,
  CheckCircle2,
  Clock,
  MapPin,
  ExternalLink,
  X,
  ChevronDown,
  ChevronUp,
  Zap,
} from 'lucide-react';

import {
  SAMBALPUR_CENTER,
  SAMBALPUR_ZOOM,
  SAMBALPUR_HOTSPOTS,
  SAMBALPUR_ROAD_RISKS,
  SAMBALPUR_CRITICAL_ASSETS,
  SAMBALPUR_CITIZEN_REPORTS,
  SAMBALPUR_DRAINAGE_NETWORK,
  SAMBALPUR_SAFE_ROUTE,
  SAMBALPUR_FLOOD_ZONES,
} from '../data/sambalpurMapData';

export default function FloodMap({
  hotspotsData = SAMBALPUR_HOTSPOTS,
  selectedHotspot,
  onSelectHotspot = () => {},
  currentStepId = 'now',
  onForecastStepChange,
}) {
  const { assetsList = SAMBALPUR_CRITICAL_ASSETS, deployPumpAtNewPoint } = useApp();
  const mapRef = useRef(null);
  const containerRef = useRef(null);
  const leafletInstance = useRef(null);

  // Separate Leaflet Layer Groups for clear toggle control
  const floodDepthGroupRef = useRef(null);
  const roadRiskGroupRef = useRef(null);
  const hotspotsGroupRef = useRef(null);
  const criticalAssetsGroupRef = useRef(null);
  const citizenReportsGroupRef = useRef(null);
  const drainageGroupRef = useRef(null);
  const safeRouteGroupRef = useRef(null);

  // Active Map Layer Toggles (Default visible per prompt spec)
  const [activeLayers, setActiveLayers] = useState({
    floodDepth: true,
    roadRisk: true,
    hotspots: true,
    criticalAssets: true,
    citizenReports: true,
    drainage: true,
    safeRoute: true,
  });

  const [isLayerPanelOpen, setIsLayerPanelOpen] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);

  // Map Forecast Step display text helper
  const getForecastLabel = (stepId) => {
    switch (stepId) {
      case '30m': return '+30 min';
      case '60m': return '+60 min';
      case '90m': return '+90 min';
      case '120m': return '+120 min';
      case '180m': return '+180 min';
      default: return 'NOW';
    }
  };

  // Color helper for risk levels
  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'CRITICAL':
        return '#EF4444'; // Red
      case 'HIGH':
        return '#F97316'; // Orange
      case 'MODERATE':
        return '#F59E0B'; // Amber
      default:
        return '#0284C7'; // Water Blue
    }
  };

  // 1. Initialize Dark Operational Leaflet Map
  useEffect(() => {
    if (!mapRef.current || leafletInstance.current) return;

    const map = L.map(mapRef.current, {
      center: SAMBALPUR_CENTER,
      zoom: SAMBALPUR_ZOOM,
      zoomControl: false,
      attributionControl: false,
    });

    leafletInstance.current = map;

    // CartoDB tile layer integration with VITE_CARTO_API_KEY
    const rawApiKey = import.meta.env.VITE_CARTO_API_KEY;
    const apiKey = rawApiKey ? String(rawApiKey).trim() : null;
    const tileUrl = apiKey
      ? `https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png?key=${apiKey}`
      : 'https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png';

    L.tileLayer(tileUrl, {
      maxZoom: 19,
      subdomains: 'abcd',
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
    }).addTo(map);

    // Initialize layer groups and add to map
    floodDepthGroupRef.current = L.layerGroup().addTo(map);
    drainageGroupRef.current = L.layerGroup().addTo(map);
    roadRiskGroupRef.current = L.layerGroup().addTo(map);
    safeRouteGroupRef.current = L.layerGroup().addTo(map);
    criticalAssetsGroupRef.current = L.layerGroup().addTo(map);
    citizenReportsGroupRef.current = L.layerGroup().addTo(map);
    hotspotsGroupRef.current = L.layerGroup().addTo(map);

    return () => {
      if (leafletInstance.current) {
        leafletInstance.current.remove();
        leafletInstance.current = null;
      }
    };
  }, []);

  // Handle Fullscreen ESC Key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isFullscreen) {
        setIsFullscreen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen]);

  // Handle map size recalculation on fullscreen toggle
  useEffect(() => {
    if (leafletInstance.current) {
      setTimeout(() => {
        leafletInstance.current.invalidateSize();
      }, 200);
    }
  }, [isFullscreen]);

  // 2. Render / Update GIS Layers on change of data, timeline step, or layer toggles
  useEffect(() => {
    const map = leafletInstance.current;
    if (!map) return;

    // Clear all existing elements in layer groups
    floodDepthGroupRef.current?.clearLayers();
    drainageGroupRef.current?.clearLayers();
    roadRiskGroupRef.current?.clearLayers();
    safeRouteGroupRef.current?.clearLayers();
    criticalAssetsGroupRef.current?.clearLayers();
    citizenReportsGroupRef.current?.clearLayers();
    hotspotsGroupRef.current?.clearLayers();

    // -------------------------------------------------------------
    // LAYER A: 2D FLOOD DEPTH OVERLAY GRID (Semi-transparent polygons)
    // -------------------------------------------------------------
    if (activeLayers.floodDepth) {
      SAMBALPUR_FLOOD_ZONES.forEach((zone) => {
        const stepData = zone.timelineDepths[currentStepId] || zone.timelineDepths.now;
        const color = getSeverityColor(stepData.level);
        const fillOpacity =
          stepData.level === 'CRITICAL'
            ? 0.55
            : stepData.level === 'HIGH'
            ? 0.45
            : stepData.level === 'MODERATE'
            ? 0.35
            : 0.25;

        const polygon = L.polygon(zone.coords, {
          color: color,
          weight: 1.5,
          fillColor: color,
          fillOpacity: fillOpacity,
          dashArray: '3, 3',
        });

        polygon.bindTooltip(
          `<div style="font-family:Inter,sans-serif; font-size:12px; color:#F9FAFB; padding:2px;">
            <strong style="color:${color};">${zone.name}</strong><br/>
            Simulated Depth: <strong>${Math.round(stepData.depth * 100)} cm</strong> (${stepData.depth.toFixed(2)}m) — ${stepData.level}
          </div>`,
          { direction: 'center', className: 'gov-dark-tooltip', sticky: true }
        );

        polygon.addTo(floodDepthGroupRef.current);
      });
    }

    // -------------------------------------------------------------
    // LAYER B: MUNICIPAL DRAINAGE NETWORK (Cyan lines)
    // -------------------------------------------------------------
    if (activeLayers.drainage) {
      SAMBALPUR_DRAINAGE_NETWORK.forEach((drain) => {
        const drainLine = L.polyline(drain.coords, {
          color: '#00F0FF',
          weight: 2.5,
          opacity: 0.8,
          dashArray: '4, 4',
        });

        drainLine.bindTooltip(
          `<div style="font-size:11px; font-family:Inter,sans-serif;">
            <strong style="color:#00F0FF;">${drain.name}</strong><br/>SWMM Stormwater Network (Simulated)
          </div>`,
          { direction: 'top', className: 'gov-dark-tooltip' }
        );

        drainLine.addTo(drainageGroupRef.current);
      });
    }

    // -------------------------------------------------------------
    // LAYER C: ROAD RISK NETWORK (Safe Blue / Caution Amber / Blocked Red dashed)
    // -------------------------------------------------------------
    if (activeLayers.roadRisk) {
      SAMBALPUR_ROAD_RISKS.forEach((road) => {
        const status = road.statusByStep[currentStepId] || road.statusByStep.now;

        let lineColor = '#0EA5E9'; // SAFE WATER BLUE
        let lineDash = null;
        let lineWeight = 3.5;

        if (status === 'CAUTION') {
          lineColor = '#F59E0B';
          lineWeight = 4;
        } else if (status === 'BLOCKED') {
          lineColor = '#EF4444';
          lineDash = '6, 6';
          lineWeight = 4;
        }

        const roadPolyline = L.polyline(road.coords, {
          color: lineColor,
          weight: lineWeight,
          opacity: 0.9,
          dashArray: lineDash,
        });

        roadPolyline.bindTooltip(
          `<div style="font-family:Inter,sans-serif; font-size:12px;">
            <strong>${road.name}</strong><br/>
            Status: <strong style="color:${lineColor};">${status}</strong>
          </div>`,
          { direction: 'top', className: 'gov-dark-tooltip' }
        );

        roadPolyline.addTo(roadRiskGroupRef.current);
      });
    }

    // -------------------------------------------------------------
    // LAYER D: SAFE ROUTING CORRIDOR (Glowing Teal / Green)
    // -------------------------------------------------------------
    if (activeLayers.safeRoute) {
      const routeLine = L.polyline(SAMBALPUR_SAFE_ROUTE.coords, {
        color: '#14B8A6',
        weight: 5,
        opacity: 0.95,
      });

      routeLine.bindTooltip(
        `<div style="font-family:Inter,sans-serif; font-size:12px; color:#14B8A6;">
          <strong>SIMULATED SAFE ROUTE CORRIDOR</strong><br/>
          Est. Travel Time: ${SAMBALPUR_SAFE_ROUTE.travelTime} (${SAMBALPUR_SAFE_ROUTE.distance})<br/>
          Status: <strong>${SAMBALPUR_SAFE_ROUTE.status}</strong>
        </div>`,
        { direction: 'top', className: 'gov-dark-tooltip' }
      );

      routeLine.addTo(safeRouteGroupRef.current);
    }

    // -------------------------------------------------------------
    // LAYER E: CRITICAL MUNICIPAL ASSETS & DEWATERING PUMPS
    // -------------------------------------------------------------
    if (activeLayers.criticalAssets && assetsList) {
      assetsList.forEach((asset) => {
        let badgeBorder = '#0284C7';
        let symbolSvg = '⚡';

        if (asset.category.includes('Hospital')) {
          badgeBorder = '#EF4444';
          symbolSvg = '🏥';
        } else if (asset.category.includes('Fire')) {
          badgeBorder = '#F59E0B';
          symbolSvg = '🚒';
        } else if (asset.category.includes('Police')) {
          badgeBorder = '#3B82F6';
          symbolSvg = '🛡️';
        } else if (asset.category.includes('Shelter')) {
          badgeBorder = '#8B5CF6';
          symbolSvg = '🏫';
        } else if (asset.isDeployed || asset.category.includes('Pump')) {
          badgeBorder = '#0EA5E9';
          symbolSvg = '⚡';
        }

        const customIcon = L.divIcon({
          html: `<div style="
            background: #0F172A;
            border: 2px solid ${badgeBorder};
            border-radius: 50%;
            width: 34px;
            height: 34px;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 15px;
            box-shadow: 0 0 12px ${badgeBorder}88;
            cursor: pointer;
          " title="${asset.name}">${symbolSvg}</div>`,
          className: 'tactical-asset-icon',
          iconSize: [34, 34],
          iconAnchor: [17, 17],
        });

        const marker = L.marker([asset.lat || 21.475, asset.lng || 83.975], { icon: customIcon });
        marker.bindTooltip(
          `<div style="font-family:Inter,sans-serif; font-size:12px;">
            <strong style="color:${badgeBorder};">${asset.name}</strong><br/>
            Category: ${asset.category}<br/>
            Status: <strong>${asset.status}</strong><br/>
            ${asset.pumpCapacity ? `Capacity: <strong>${asset.pumpCapacity}</strong>` : ''}
          </div>`,
          { direction: 'top', className: 'gov-dark-tooltip' }
        );

        marker.addTo(criticalAssetsGroupRef.current);
      });
    }

    // -------------------------------------------------------------
    // LAYER F: CITIZEN FIELD REPORTS (Warning alert pins)
    // -------------------------------------------------------------
    if (activeLayers.citizenReports) {
      SAMBALPUR_CITIZEN_REPORTS.forEach((report) => {
        const reportIcon = L.divIcon({
          html: `<div style="
            background: #7C2D12;
            border: 1.5px solid #F97316;
            color: #FFEDD5;
            border-radius: 4px;
            padding: 2px 6px;
            font-size: 10px;
            font-weight: 700;
            display: flex;
            align-items: center;
            gap: 3px;
            box-shadow: 0 2px 6px rgba(0,0,0,0.4);
            cursor: pointer;
          ">
            <span>⚠️</span> Report
          </div>`,
          className: 'tactical-report-icon',
          iconSize: [60, 22],
          iconAnchor: [30, 11],
        });

        const marker = L.marker([report.lat, report.lng], { icon: reportIcon });

        const popupHtml = `
          <div style="font-family: Inter, sans-serif; font-size: 12px; color: #F9FAFB; padding: 4px; min-width: 200px;">
            <div style="font-weight: 700; color: #F97316; margin-bottom: 4px; font-size: 13px;">
              Citizen Flood Report
            </div>
            <div style="margin-bottom: 4px; font-weight: 600;">${report.title}</div>
            <div style="color: #9CA3AF; font-size: 11px; margin-bottom: 6px;">
              Reported: <strong>${report.time}</strong> • Depth: <strong style="color:#EF4444;">${report.depthText}</strong>
            </div>
            <div style="background: #1F2937; padding: 6px; border-radius: 4px; border-left: 3px solid #3B82F6; font-size: 11px; margin-bottom: 6px;">
              Status: <strong>${report.status}</strong><br/>
              ${report.verifiedNote}
            </div>
            <div style="font-size: 10px; color: #6B7280; font-style: italic;">
              Citizen reports provide validation evidence for the control room.
            </div>
          </div>
        `;

        marker.bindPopup(popupHtml, { className: 'gov-dark-popup' });
        marker.addTo(citizenReportsGroupRef.current);
      });
    }

    // -------------------------------------------------------------
    // LAYER G: FLOOD HOTSPOTS (Tactical markers with depth badges)
    // -------------------------------------------------------------
    if (activeLayers.hotspots) {
      hotspotsData.forEach((hotspot) => {
        const stepInfo =
          hotspot.timelineData[currentStepId] || hotspot.timelineData.now;
        const isEscalated = hotspot.incidentStatus === 'ESCALATED';
        const color = isEscalated ? '#BE123C' : getSeverityColor(stepInfo.severity);
        const isSelected = selectedHotspot?.id === hotspot.id;

        const depthCm = stepInfo.depthCm || Math.round(stepInfo.depth * 100);
        const depthLabel = isEscalated ? '🚨 ESCALATED' : `${depthCm} cm`;

        const customIcon = L.divIcon({
          html: `<div class="hotspot-tactical-pin ${isSelected ? 'selected' : ''}" style="
            position: relative;
            display: flex;
            flex-direction: column;
            align-items: center;
            cursor: pointer;
          ">
            <div style="
              position: absolute;
              width: ${isSelected || isEscalated ? '48px' : '36px'};
              height: ${isSelected || isEscalated ? '48px' : '36px'};
              border-radius: 50%;
              background: ${color}44;
              border: 2px solid ${color};
              animation: pulseRing ${isEscalated ? '1s' : '2s'} infinite;
              top: -6px;
            "></div>
            <div style="
              background: #0F172A;
              border: 2px solid ${color};
              border-radius: 12px;
              padding: 2px 7px;
              font-size: 11px;
              font-weight: 700;
              color: #F9FAFB;
              box-shadow: 0 2px 8px rgba(0,0,0,0.6);
              white-space: nowrap;
              z-index: 2;
            ">
              <span style="color:${color}; font-size:12px;">${isEscalated ? '🚨' : '●'}</span> ${depthLabel}
            </div>
            <div style="
              width: 2px;
              height: 8px;
              background: ${color};
              z-index: 1;
            "></div>
          </div>`,
          className: 'tactical-hotspot-marker',
          iconSize: [40, 40],
          iconAnchor: [20, 32],
        });

        const marker = L.marker([hotspot.lat, hotspot.lng], { icon: customIcon });

        const popupContent = document.createElement('div');
        popupContent.style.cssText = 'font-family: Inter, sans-serif; font-size: 12px; color: #F9FAFB; padding: 4px; min-width: 210px;';
        popupContent.innerHTML = `
          <div style="font-weight: 700; color: #0EA5E9; font-size: 13px; margin-bottom: 2px;">
            ${hotspot.name}
          </div>
          <div style="font-size: 11px; color: #9CA3AF; margin-bottom: 6px;">
            ${hotspot.zone}
          </div>

          <div style="display: inline-block; background: ${color}22; border: 1px solid ${color}; color: ${color}; font-weight: 700; font-size: 10px; padding: 2px 6px; border-radius: 4px; margin-bottom: 8px;">
            ${stepInfo.severity} FLOOD RISK
          </div>

          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 6px; background: #1E293B; padding: 6px; border-radius: 4px; font-size: 11px; margin-bottom: 8px;">
            <div>
              <span style="color:#9CA3AF; display:block; font-size:10px;">Predicted Depth:</span>
              <strong style="color:#F9FAFB; font-size:12px;">${depthCm} cm</strong> <span style="font-size:10px; color:#64748B;">(${stepInfo.depth.toFixed(2)}m)</span>
            </div>
            <div>
              <span style="color:#9CA3AF; display:block; font-size:10px;">Expected Onset:</span>
              <strong style="color:#F9FAFB;">${stepInfo.onset === 0 ? 'Active Now' : stepInfo.onset + ' min'}</strong>
            </div>
            <div>
              <span style="color:#9CA3AF; display:block; font-size:10px;">Duration:</span>
              <strong style="color:#F9FAFB;">${stepInfo.duration} min</strong>
            </div>
            <div>
              <span style="color:#9CA3AF; display:block; font-size:10px;">Confidence:</span>
              <strong style="color:#0EA5E9;">${hotspot.confidence}</strong>
            </div>
          </div>
        `;

        const viewDetailsBtn = document.createElement('button');
        viewDetailsBtn.innerText = 'View Details →';
        viewDetailsBtn.style.cssText = 'width: 100%; background: #0EA5E9; color: #0C4A6E; border: none; padding: 5px 8px; font-weight: 700; border-radius: 4px; cursor: pointer; font-size: 11px; margin-bottom: 4px;';
        viewDetailsBtn.onclick = () => {
          onSelectHotspot(hotspot);
        };

        const deployPumpBtn = document.createElement('button');
        deployPumpBtn.innerText = '⚡ Deploy Mobile Dewatering Pump Here';
        deployPumpBtn.style.cssText = 'width: 100%; background: #0284C7; color: #FFFFFF; border: none; padding: 5px 8px; font-weight: 700; border-radius: 4px; cursor: pointer; font-size: 11px;';
        deployPumpBtn.onclick = (e) => {
          e.stopPropagation();
          deployPumpAtNewPoint({
            name: `Mobile Dewatering Pump (${hotspot.name})`,
            location: hotspot.name,
            lat: hotspot.lat,
            lng: hotspot.lng,
            pumpCapacity: '8,000 L/min Emergency Pump Rig',
          });
        };

        popupContent.appendChild(viewDetailsBtn);
        popupContent.appendChild(deployPumpBtn);

        marker.bindPopup(popupContent, { className: 'gov-dark-popup' });
        marker.on('click', () => {
          onSelectHotspot(hotspot);
        });

        marker.addTo(hotspotsGroupRef.current);
      });
    }

    // Pan smoothly to selected hotspot if active
    if (selectedHotspot) {
      map.panTo([selectedHotspot.lat, selectedHotspot.lng], {
        animate: true,
        duration: 0.4,
      });
    }
  }, [hotspotsData, selectedHotspot, currentStepId, activeLayers]);

  // Map Controls Handlers
  const handleZoomIn = () => leafletInstance.current?.zoomIn();
  const handleZoomOut = () => leafletInstance.current?.zoomOut();
  const handleLocateMe = () => {
    leafletInstance.current?.setView(SAMBALPUR_CENTER, SAMBALPUR_ZOOM);
  };

  const toggleLayer = (key) => {
    setActiveLayers((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  return (
    <div
      ref={containerRef}
      className={`tactical-gis-container ${isFullscreen ? 'fullscreen-mode' : ''}`}
    >
      {/* ------------------------------------------------------------- */}
      /* TOP TACTICAL MAP STATUS BAR */
      {/* ------------------------------------------------------------- */}
      <div className="tactical-map-topbar">
        <div className="topbar-left">
          <div className="demo-tag">HYBRID DEMO SIMULATION</div>
          <div className="location-name">
            <MapPin size={14} className="text-teal" />
            <span>SAMBALPUR, ODISHA</span>
          </div>
          <div className="topbar-divider" />
          <div className="forecast-time-badge">
            <Clock size={13} />
            <span>Forecast: <strong>{getForecastLabel(currentStepId)}</strong></span>
          </div>
        </div>

        <div className="topbar-right">
          <div className="route-status-pill">
            <span className="dot-active">●</span>
            <span>Safe Route: <strong>Available (14 min)</strong></span>
          </div>

          <button
            className="fullscreen-toggle-btn"
            onClick={() => setIsFullscreen(!isFullscreen)}
            title={isFullscreen ? 'Exit Fullscreen (ESC)' : 'Expand Map Fullscreen'}
          >
            {isFullscreen ? <Minimize2 size={16} /> : <Maximize2 size={16} />}
            <span>{isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      /* LEAFLET CANVAS ELEMENT */
      {/* ------------------------------------------------------------- */}
      <div ref={mapRef} className="leaflet-gis-map" />

      {/* ------------------------------------------------------------- */}
      /* MAP CONTROL STACK (Zoom, Center, Layers Toggle) */
      {/* ------------------------------------------------------------- */}
      <div className="gov-map-controls">
        <div className="zoom-btn-stack">
          <button
            className="gov-map-btn"
            onClick={handleZoomIn}
            title="Zoom In"
            aria-label="Zoom In"
          >
            <Plus size={15} />
          </button>
          <button
            className="gov-map-btn"
            onClick={handleZoomOut}
            title="Zoom Out"
            aria-label="Zoom Out"
          >
            <Minus size={15} />
          </button>
        </div>

        <button
          className="gov-map-btn locate-btn"
          onClick={handleLocateMe}
          title="Center on Sambalpur, Odisha"
          aria-label="Center Map"
        >
          <Navigation size={14} />
        </button>

        <div className="layers-dropdown-wrap">
          <button
            className={`gov-map-btn layers-btn ${isLayerPanelOpen ? 'active' : ''}`}
            onClick={() => setIsLayerPanelOpen(!isLayerPanelOpen)}
            title="Toggle Map Layers Panel"
          >
            <Layers size={14} />
            <span>Layers</span>
          </button>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      /* COLLAPSIBLE MAP LAYERS PANEL (Tactical Dark Overlay) */
      {/* ------------------------------------------------------------- */}
      {isLayerPanelOpen && (
        <div className="tactical-layers-panel">
          <div className="layers-panel-header">
            <div className="panel-title-wrap">
              <Layers size={15} className="text-teal" />
              <h4>Map Layers (7)</h4>
            </div>
            <button
              className="panel-close-btn"
              onClick={() => setIsLayerPanelOpen(false)}
            >
              <X size={14} />
            </button>
          </div>

          <div className="layers-panel-body">
            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.floodDepth}
                onChange={() => toggleLayer('floodDepth')}
              />
              <span className="layer-dot" style={{ background: '#F97316' }} />
              <span>2D Flood Depth Grid</span>
            </label>

            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.roadRisk}
                onChange={() => toggleLayer('roadRisk')}
              />
              <span className="layer-dot" style={{ background: '#F59E0B' }} />
              <span>Road Risk Network</span>
            </label>

            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.hotspots}
                onChange={() => toggleLayer('hotspots')}
              />
              <span className="layer-dot" style={{ background: '#EF4444' }} />
              <span>Flood Hotspots</span>
            </label>

            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.criticalAssets}
                onChange={() => toggleLayer('criticalAssets')}
              />
              <span className="layer-dot" style={{ background: '#3B82F6' }} />
              <span>Critical Municipal Assets</span>
            </label>

            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.citizenReports}
                onChange={() => toggleLayer('citizenReports')}
              />
              <span className="layer-dot" style={{ background: '#7C2D12' }} />
              <span>Citizen Field Reports</span>
            </label>

            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.drainage}
                onChange={() => toggleLayer('drainage')}
              />
              <span className="layer-dot" style={{ background: '#00F0FF' }} />
              <span>Municipal Drainage (SWMM)</span>
            </label>

            <label className="tactical-checkbox-row">
              <input
                type="checkbox"
                checked={activeLayers.safeRoute}
                onChange={() => toggleLayer('safeRoute')}
              />
              <span className="layer-dot" style={{ background: '#14B8A6' }} />
              <span>Safe Routing Corridor</span>
            </label>
          </div>
        </div>
      )}

      {/* ------------------------------------------------------------- */}
      /* FLOATING COMPACT MAP LEGEND */
      {/* ------------------------------------------------------------- */}
      <div className="tactical-map-legend">
        <div className="legend-header">
          <span>Simulation &amp; Route Legend</span>
          <span className="step-tag">{getForecastLabel(currentStepId)}</span>
        </div>

        <div className="legend-items-grid">
          <div className="legend-item">
            <span className="dot" style={{ background: '#3B82F6' }} />
            <span>0.05–0.10 m (Low)</span>
          </div>
          <div className="legend-item">
            <span className="dot" style={{ background: '#F59E0B' }} />
            <span>0.10–0.40 m (Med)</span>
          </div>
          <div className="legend-item">
            <span className="dot" style={{ background: '#F97316' }} />
            <span>0.40–0.70 m (High)</span>
          </div>
          <div className="legend-item">
            <span className="dot" style={{ background: '#EF4444' }} />
            <span>&gt;0.70 m (Critical)</span>
          </div>

          <div className="legend-divider" />

          <div className="legend-item">
            <span className="line-sample safe-route" />
            <span>━━ Open / Safe Route</span>
          </div>
          <div className="legend-item">
            <span className="line-sample caution-route" />
            <span>━━ Caution Corridor</span>
          </div>
          <div className="legend-item">
            <span className="line-sample blocked-route" />
            <span>- - Blocked Route</span>
          </div>
        </div>
      </div>

      {/* ------------------------------------------------------------- */}
      /* UNOBTRUSIVE DISCLAIMER FOOTER */
      {/* ------------------------------------------------------------- */}
      <div className="tactical-disclaimer-badge">
        SIH Prototype • Flood layers shown are simulation/demo data for Sambalpur, Odisha.
      </div>
    </div>
  );
}
