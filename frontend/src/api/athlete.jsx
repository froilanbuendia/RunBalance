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

export const fetchMileage = () => {
  return apiFetch(`/api/metrics/mileage`);
};

export const fetchLoad = () => {
  return apiFetch(`/api/metrics/load`);
};

export const fetchPaceTrend = () => {
  return apiFetch(`/api/metrics/pace-trend`);
};

export const fetchPaceAvg = () => {
  return apiFetch(`/api/metrics/pace-avg`);
};

export const syncActivities = () => {
  return apiFetch(`/api/activities/sync`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};
