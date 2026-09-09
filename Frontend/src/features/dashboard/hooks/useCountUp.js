import { useEffect, useRef, useState } from 'react';

/** Cuenta ascendente cubic-out desde 0 hasta `target`, iniciando tras `delay` ms. */
export function useCountUp(target, { delay = 0, duration = 1300, disabled = false } = {}) {
  const [value, setValue] = useState(disabled ? target : 0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (disabled) {
      setValue(target);
      return undefined;
    }

    let start = null;
    const timer = setTimeout(() => {
      const tick = (now) => {
        if (start === null) start = now;
        const elapsed = now - start;
        const p = Math.min(1, elapsed / duration);
        const eased = 1 - Math.pow(1 - p, 3);
        setValue(target * eased);
        if (p < 1) rafRef.current = requestAnimationFrame(tick);
      };
      rafRef.current = requestAnimationFrame(tick);
    }, delay);

    return () => {
      clearTimeout(timer);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [target, delay, duration, disabled]);

  return value;
}
