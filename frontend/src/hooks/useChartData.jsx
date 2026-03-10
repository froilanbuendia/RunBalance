import { useEffect, useState } from "react";
const useChartData = (range, fetchFn) => {
  const [data, setData] = useState(null);
  console.log("chart hook");

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const result = await fetchFn(range);
        if (isMounted) setData(result);
      } catch (err) {
        console.error(err);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [range, fetchFn]);

  return data;
};

export default useChartData;
