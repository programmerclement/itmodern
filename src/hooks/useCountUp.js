import { useEffect, useRef, useState } from 'react';

const EASE_OUT_CUBIC = (t) => 1 - (1 - t) ** 3;

export function useCountUp(target, { duration = 800 } = {}) {
  const numericTarget = Number(target) || 0;
  const [value, setValue] = useState(numericTarget);
  const frameRef = useRef(null);

  useEffect(() => {
    const prefersReducedMotion =
      typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion) {
      setValue(numericTarget);
      return undefined;
    }

    const startTime = performance.now();
    setValue(0);

    function tick(now) {
      const progress = Math.min((now - startTime) / duration, 1);
      setValue(numericTarget * EASE_OUT_CUBIC(progress));
      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick);
      }
    }

    frameRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frameRef.current);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [numericTarget, duration]);

  return value;
}
