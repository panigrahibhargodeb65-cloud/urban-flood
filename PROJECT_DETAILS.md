# Urban Flood Intelligence System (SIH Problem Statement 26085)
## Complete Project Implementation & Design Documentation

---

## 1. Executive Summary & System Purpose

The **Urban Flood Intelligence System** is a real-time, street-level flood monitoring and response platform designed for municipal authorities, emergency administrators, and citizens. 

### Core SIH Product Pipeline
$$\text{Predict} \longrightarrow \text{Inform} \longrightarrow \text{Act} \longrightarrow \text{Verify} \longrightarrow \text{Resolve} \longrightarrow \text{Learn}$$

The system focuses on delivering **street-level flood intelligence**: water depth (meters), expected onset time (minutes), expected duration, severity levels, root cause analysis, affected road networks, and nearby critical infrastructure risks.

---

## 2. Implemented Pages & Features

### Page 1 — Redesigned Login Page
- **Full-Screen Continuous Rain Video Background**: Renders high-definition rain video (`/rain-bg.mp4`) with `autoPlay`, `muted`, `loop`, `playsInline`, and `object-fit: cover`.
- **Watermark Removal**: Applied `transform: scale(1.3)` with `transform-origin: top left` to crop out video watermarks.
- **Transparent Frosted Glass Aesthetic**: Uses dark navy transparent glass (`backdrop-filter: blur(20px)`) allowing the background rain video to remain visible across the viewport.
- **Role Selector Tabs**: Clean 3-tab role selector `[ Government ] [ Admin ] [ Citizen ]` with dynamic scope indicators (*Municipal Level*, *Control Center*, *Public Access*).
- **Form Controls**: Email/Phone input, Password input, Remember me checkbox, Forgot password link, primary Sign In button, and security badge (*"Secure access • Real-time flood intelligence"*).

---

### Page 2 — Government Dashboard (Command Center)

The main demonstration page of the system built as a 3-column municipal emergency command center layout:

```
┌──────────────────────────────────────────────────────────────┐
│ HEADER (Logo • Nav Tabs • System Status • Timestamp • User)   │
├──────────────────────────────────────────────────────────────┤
│ SUMMARY BAR (Active Hotspots • Critical • High • Roads)      │
├───────────────┬──────────────────────────────┬───────────────┤
│               │                              │               │
│ PRIORITY      │       LIVE GIS MAP           │ SELECTED      │
│ HOTSPOTS      │  (Leaflet Dark Map • Pins)   │ HOTSPOT       │
│ (Search/Filter)                              │ DETAILS       │
│               │                              │ (Actions)     │
│               │                              │               │
├───────────────┴──────────────────────────────┴───────────────┤
│          0–3 HOUR FORECAST TIMELINE CONTROLLER               │
└──────────────────────────────────────────────────────────────┘
```

#### Key Dashboard Components:

1. **Top Header (`DashboardHeader.jsx`)**:
   - Title: *"Urban Flood Intelligence System"* + Subtitle *"Smart Urban Flood Monitoring & Response"*.
   - Navigation links: `Dashboard` (active), `Flood Map`, `Hotspots`, `Incidents`, `Assets`.
   - Live status badge: `● System Online`, `Last Updated: 10:42 AM`, notification bell count, user profile (`Cmdr. V. Sharma`), and an `Exit` button to return to login.

2. **Live KPI Summary Bar (`SummaryBar.jsx`)**:
   - Metrics cards displaying: *Active Hotspots (12)*, *Critical Risk (3)*, *High Risk (5)*, *Moderate Risk (4)*, *Affected Roads (8)*, and *Assets at Risk (6)*.

3. **Left Panel — Priority Hotspots (`PriorityHotspots.jsx`)**:
   - Real-time search bar (`"Search location..."`).
   - Filter tabs: `ALL`, `CRITICAL`, `HIGH`, `MODERATE`.
   - Scrollable card list showing location name, current water depth, onset time, duration, and cause preview. Selecting a card updates the map and details panel instantly.

4. **Center Panel — Live GIS Flood Map (`FloodMap.jsx`)**:
   - Interactive Leaflet map styled with a dark theme filter (`brightness(85%) contrast(110%)`).
   - Dynamic circle risk markers (Green, Yellow, Orange, Red) scaled by severity and water depth.
   - Affected road network polyline overlays and drainage canal lines.
   - Critical asset pins (🏥 Hospital, 🚒 Fire Station, 🚓 Police Station, 🏫 School) and citizen report markers (⚠️).
   - Map controls: Zoom in/out, reset view center, layers menu dropdown toggle, and risk legend.

5. **Right Panel — Selected Hotspot Details (`HotspotDetails.jsx`)**:
   - Header showing selected location and severity badge.
   - Metrics grid: *Flood Depth (0.82 m)*, *Expected Onset (18 min)*, *Expected Duration (74 min)*, *Severity (Critical)*.
   - Info rows: *Likely Cause*, *Incident Status*, *Confidence (91%)*, *Data Source*, *Last Updated*.
   - Nearby Critical Assets list with precise distances.
   - Action Buttons:
     - `[ View Full Details ]`: Opens the Street-Level Intelligence Report modal.
     - `[ Create Incident ]`: Creates a demo incident and displays a toast alert.
     - `[ Assign Response ]`: Opens the Response Unit Assignment drawer.

6. **Bottom Panel — 0–3 Hour Forecast Timeline (`ForecastTimeline.jsx`)**:
   - Time steps: `NOW`, `+30 MIN`, `+60 MIN`, `+90 MIN`, `+120 MIN`, `+180 MIN`.
   - Draggable range slider synchronized with timeline steps.
   - **Real-Time Dynamic Update**: Moving the timeline slider updates flood depths, risk levels, and map marker colors dynamically across all dashboard panels.

7. **Interactive Modals & Toasts**:
   - **`AssignmentModal.jsx`**: Emergency response unit assignment form (NDRF, Municipal Task Force, Traffic Police, Fire & Rescue).
   - **`HotspotDetailsModal.jsx`**: Comprehensive report featuring a 3-Hour depth hydrograph bar chart, hydraulic root cause analysis, and traffic road closure recommendations.
   - **`Toast.jsx`**: Confirmation toast notification popup.

---

## 3. Design System & Aesthetics Specification

### Color Palette
- **Background Navy**: `#060b16` / `#070c18` / `#0a1226`
- **Panel Surface Glass**: `rgba(10, 18, 36, 0.38)` – `rgba(10, 17, 34, 0.65)`
- **Glass Border**: `rgba(255, 255, 255, 0.12)` – `rgba(255, 255, 255, 0.16)`
- **Backdrop Blur**: `backdrop-filter: blur(14px)` to `blur(20px)`
- **Primary Accent Blue**: `#2563eb` (Hover `#1d4ed8`, Light `#60a5fa`)

### Risk Color System
| Risk Level | Color Code | Condition / Water Depth |
| :--- | :--- | :--- |
| **CRITICAL** | `#ef4444` (Red) | Severe flooding ($>0.7\text{ m}$ depth), high asset risk |
| **HIGH** | `#f97316` (Orange) | Heavy flooding ($0.4\text{ m} - 0.7\text{ m}$ depth) |
| **MODERATE** | `#eab308` (Yellow) | Moderate accumulation ($0.2\text{ m} - 0.4\text{ m}$ depth) |
| **SAFE** | `#22c55e` (Green) | Minor/no flooding ($<0.2\text{ m}$ depth), system online |

---

## 4. Codebase Architecture

```
sih/
├── public/
│   ├── rain-bg.mp4                 # Background rain video asset
│   ├── favicon.svg
│   └── icons.svg
├── src/
│   ├── data/
│   │   └── hotspots.js             # Mock dataset for hotspots, timelines & assets
│   ├── components/
│   │   ├── LoginPage.jsx           # Preserved transparent rain login page
│   │   ├── GovernmentDashboard.jsx # Main Page 2 command center container
│   │   ├── DashboardHeader.jsx     # Top header & navigation bar
│   │   ├── SummaryBar.jsx          # Live KPI metrics summary bar
│   │   ├── PriorityHotspots.jsx    # Left panel hotspots search & list
│   │   ├── FloodMap.jsx            # Center Leaflet GIS interactive map
│   │   ├── HotspotDetails.jsx      # Right panel hotspot details & actions
│   │   ├── ForecastTimeline.jsx    # Bottom 0-3h prediction timeline slider
│   │   ├── AssignmentModal.jsx     # Response unit dispatch modal drawer
│   │   ├── HotspotDetailsModal.jsx # Intelligence report & hydrograph modal
│   │   └── Toast.jsx               # Notification toast component
│   ├── App.jsx                     # Top-level router between Login & Dashboard
│   ├── main.jsx                    # React root entry
│   └── index.css                   # Complete design system & responsive CSS
├── PROJECT_DETAILS.md              # Project documentation
├── package.json
└── vite.config.js                  # Vite build & watch configuration
```

---

## 5. Verification & Testing Instructions

1. **Development Server**:
   ```bash
   npm run dev
   ```
   Open `http://localhost:5173/` in your browser.

2. **Production Build Verification**:
   ```bash
   npm run build
   ```
   Build output compiles cleanly with **0 errors**.
