import { useEffect, useState } from "react";
import { fetchLoad, fetchPaceAvg, fetchAcwr } from "../api/athlete";
import { useSync } from "../context/SyncContext";

const useDashboardData = () => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  const { syncVersion } = useSync();

  useEffect(() => {
    const load = async () => {
      setLoading(true);

      const [acwr, load, paceAvg] = await Promise.all([
        fetchAcwr(),
        fetchLoad(),
        fetchPaceAvg(),
      ]);

      setData({
        acwr,
        ...load,
        paceAvg,
      });

      setLoading(false);
    };

    load();
  }, [syncVersion]);

  return { data, loading };
};

export default useDashboardData;
