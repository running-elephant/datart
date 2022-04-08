import { useState, useEffect } from "react";

export function useWindowResize() {
  const [state, setState] = useState({
    width: 0,
    height: 0,
  });

  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }
    const handler = () => {
      setState((state) => {
        const { innerWidth, innerHeight } = window;
        //Check state for change, return same state if no change happened to prevent rerender
        return state.width !== innerWidth || state.height !== innerHeight
          ? {
              width: innerWidth,
              height: innerHeight,
            }
          : state;
      });
    };

    handler();
    window.addEventListener("resize", handler, {
      capture: false,
      passive: true,
    });
    return () => {
      window.removeEventListener("resize", handler);
    };
  }, []);

  return state;
}
