import { useCallback, useEffect, useState } from 'react';

interface UseSplitSizesProps {
  limitedSide: 0 | 1;
  range: [number, number];
}

export function useSplitSizes({ limitedSide, range }: UseSplitSizesProps) {
  const [sizes, setSizes] = useState([0, 0]);
  const [minSize, maxSize] = range;

  const onResize = useCallback(() => {
    const minPct = Math.floor(
      (minSize / document.documentElement.clientWidth) * 100,
    );
    const pct = Math.max(minPct, sizes[0]);
    if (pct !== sizes[0]) {
      setSizes([pct, 100 - pct]);
    }
  }, [sizes, minSize]);

  useEffect(() => {
    onResize();
    window.addEventListener('resize', onResize, false);
    return () => {
      window.removeEventListener('resize', onResize);
    };
  }, [onResize]);

  return { sizes, setSizes };
}
