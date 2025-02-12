import { useEffect, useState } from "react";

const usePolling = <T,>(func: () => Promise<T>, delay: number): T | null => {
  const [data, setData] = useState<T | null>(null);

  useEffect(() => {
    const fetch = async () => {
      try {
        const response = await func();
        setData(response);
      } catch (error) {
        console.error(error);
      }
    };

    const intervalId = setInterval(fetch, delay);

    return () => clearInterval(intervalId);
  }, [func, delay]);

  return data;
};

export { usePolling };
