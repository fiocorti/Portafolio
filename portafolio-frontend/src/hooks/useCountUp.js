import { useEffect, useState } from 'react';

const DEFAULT_DURATION = 900;

function prefersReducedMotion() {
  return typeof window !== 'undefined' && typeof window.matchMedia === 'function'
    && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

// Cuenta desde 0 hasta `target` una vez al montar (o cuando cambia el valor).
// Si el usuario pide menos movimiento, muestra el valor final directamente.
export default function useCountUp(target, duration = DEFAULT_DURATION) {
  const numeric = typeof target === 'number' && Number.isFinite(target);
  const [current, setCurrent] = useState(() => (numeric && prefersReducedMotion() ? target : 0));

  useEffect(() => {
    if (!numeric) return undefined;
    if (prefersReducedMotion()) {
      setCurrent(target);
      return undefined;
    }
    let frame = 0;
    const start = window.performance.now();
    const step = now => {
      const progress = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      setCurrent(Math.round(target * eased));
      if (progress < 1) frame = window.requestAnimationFrame(step);
    };
    setCurrent(0);
    frame = window.requestAnimationFrame(step);
    return () => window.cancelAnimationFrame(frame);
  }, [numeric, target, duration]);

  return numeric ? current : target;
}
