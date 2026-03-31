import { useEffect, useState } from "react";
import { fetchLoad, fetchPaceAvg, fetchAcwr, fetchPersonalRecords, fetchStreak, fetchRunTypeBreakdown } from "../api/athlete";
import { useSync } from "../context/SyncContext";

const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { syncVersion } = useSync();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [acwr, load, paceAvg, prs, streakData, runTypes] = await Promise.all([
        fetchAcwr(),
        fetchLoad(),
        fetchPaceAvg(),
        fetchPersonalRecords(),
        fetchStreak(),
        fetchRunTypeBreakdown(),
      ]);

      setData({
        acwr,
        ...load,
        paceAvg,
        prs,
        streak: streakData.streak,
        runTypes,
      });

      setLoading(false);
    };

    load();
  }, [syncVersion]);

  return { data, loading };
};

export default useDashboardData;
