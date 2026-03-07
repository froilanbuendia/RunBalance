import { useEffect, useState } from "react";
import {
  fetchMileage,
  fetchLoad,
  fetchPaceAvg,
  fetchPaceTrend,
  fetchAcwr,
} from "../api/athlete";
import { useSync } from "../context/SyncContext";

const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { syncVersion } = useSync();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [mileage, acwr, load, paceAvg, paceTrend] = await Promise.all([
        fetchMileage(),
        fetchAcwr(),
        fetchLoad(),
        fetchPaceAvg(),
        fetchPaceTrend(),
      ]);

      setData({
        mileage,
        acwr,
        ...load,
        paceAvg,
        paceTrend,
      });

      setLoading(false);
    };

    load();
  }, [syncVersion]);

  return { data, loading };
};

export default useDashboardData;
