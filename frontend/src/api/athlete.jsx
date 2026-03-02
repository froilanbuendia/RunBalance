import { apiFetch } from "./client";
export const fetchAthleteProfile = () => {
  return apiFetch(`/api/athlete/profile`);
};

export const fetchDashboardData = () => {
  return apiFetch(`/api/metrics/overview`);
};

export const syncActivities = () => {
  return apiFetch(`/api/activities/sync`, {
    method: "POST",
    body: JSON.stringify({}),
  });
};
