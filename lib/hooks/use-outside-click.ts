import { useEffect, useRef } from "react";

const useOutsideClick = (callback) => {
  const ref = useRef<HTMLDivElement>(undefined);

  useEffect(() => {
    const handleClick = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        callback();
      }
    };

    document.addEventListener("click", handleClick, true);

    return () => {
      document.removeEventListener("click", handleClick, true);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [ref]);

  return ref;
};

export { useOutsideClick };
