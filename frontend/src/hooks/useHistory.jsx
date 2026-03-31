import { useCallback, useEffect, useRef, useState } from "react";
import { fetchHistory } from "../api/athlete";
import { useSync } from "../context/SyncContext";

const useHistory = (pageSize, typeFilter) => {
  const [page, setPage] = useState(0);
  const [activities, setActivities] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const { syncVersion } = useSync();

  // Detect when a full reset is needed (syncVersion or typeFilter changed)
  const resetKeyRef = useRef(`${syncVersion}:${typeFilter}`);

  useEffect(() => {
    let isMounted = true;

    const resetKey = `${syncVersion}:${typeFilter}`;
    const isReset = resetKeyRef.current !== resetKey;
    if (isReset) resetKeyRef.current = resetKey;

    const effectivePage = isReset ? 0 : page;

    fetchHistory({
      limit: pageSize,
      offset: effectivePage * pageSize,
      ...(typeFilter ? { type: typeFilter } : {}),
    })
      .then((result) => {
        if (!isMounted) return;
        setTotal(result.total);
        setActivities((prev) =>
          effectivePage === 0
            ? result.activities
            : [...prev, ...result.activities],
        );
        if (isReset) setPage(0);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [page, pageSize, typeFilter, syncVersion]);

  const loadMore = useCallback(() => setPage((p) => p + 1), []);

  return {
    activities,
    total,
    loading,
    loadMore,
    hasMore: activities.length < total,
  };
};

export default useHistory;
