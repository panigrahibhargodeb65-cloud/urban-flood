import {
  SAMBALPUR_HOTSPOTS,
  SAMBALPUR_CRITICAL_ASSETS,
  SAMBALPUR_CITIZEN_REPORTS,
} from './sambalpurMapData';

export const TIMELINE_STEPS = [
  { id: 'now', label: 'NOW', offsetMin: 0 },
  { id: '30m', label: '+30 MIN', offsetMin: 30 },
  { id: '60m', label: '+60 MIN', offsetMin: 60 },
  { id: '90m', label: '+90 MIN', offsetMin: 90 },
  { id: '120m', label: '+120 MIN', offsetMin: 120 },
  { id: '180m', label: '+180 MIN', offsetMin: 180 },
];

export const INITIAL_SUMMARY = {
  activeHotspots: 12,
  criticalCount: 3,
  highCount: 5,
  moderateCount: 4,
  affectedRoads: 8,
  criticalAssetsAtRisk: 6,
  lastUpdated: '10:42 AM',
};

export const HOTSPOTS_DATA = SAMBALPUR_HOTSPOTS;
export const CRITICAL_ASSETS_MAP = SAMBALPUR_CRITICAL_ASSETS;
export const CITIZEN_REPORTS_MAP = SAMBALPUR_CITIZEN_REPORTS;
