/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useRef } from "react";

const useEffectOnce = (fn) => {
  const isFirstRender = useRef(true);
  useEffect(() => {
    if (isFirstRender.current) fn();
    isFirstRender.current = false;
  }, []);
};

export { useEffectOnce };
