import { apiFetch } from "./client";
export const fetchAthleteProfile = () => {
  return apiFetch(`/api/athlete/profile`);
};

export const fetchDashboardData = () => {
  return apiFetch(`/api/metrics/overview`);
};

export const fetchAcwr = () => {
  return apiFetch(`/api/metrics/injury`);
};

export const fetchMileage = (range) => {
  return apiFetch(`/api/metrics/mileage?range=${range}`);
};

export const fetchLoad = () => {
  return apiFetch(`/api/metrics/load`);
};

export const fetchPaceTrend = (range) => {
  return apiFetch(`/api/metrics/pace-trend?range=${range}`);
};

export const fetchHeatmapData = (metric) => {
  return apiFetch(`/api/metrics/heatmap?metric=${metric}`);
};

export const fetchPaceAvg = () => {
  return apiFetch(`/api/metrics/pace-avg`);
};

export const fetchRunStats = () => apiFetch("/api/activities/stats");

export const fetchPersonalRecords = () => apiFetch("/api/activities/personal-records");

export const fetchStreak = () => apiFetch("/api/activities/streak");

export const fetchRunTypeBreakdown = () => apiFetch("/api/activities/run-type-breakdown");

export const fetchHistory = (params = {}) => {
  const qs = new URLSearchParams(
    Object.fromEntries(Object.entries(params).filter(([, v]) => v != null))
  ).toString();
  return apiFetch(`/api/activities/history${qs ? `?${qs}` : ""}`);
};

export const syncActivities = () => {
  return apiFetch(`/api/activities/sync`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};
