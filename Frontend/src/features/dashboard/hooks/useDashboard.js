import { useState, useEffect, useCallback, useRef } from 'react';
import { getDashboardData, EMPTY_DASHBOARD_DATA } from '../services/dashboardService';

const REFRESH_INTERVAL_MS = 45_000;
const FOCUS_THROTTLE_MS = 3_000;

export function useDashboard(periodo = 'Esta semana') {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const abortRef = useRef(null);
  const lastFetchRef = useRef(0);
  const hasLoadedRef = useRef(false);

  const fetchDashboard = useCallback(
    async ({ silent = false } = {}) => {
      if (abortRef.current) {
        abortRef.current.abort();
      }
      const controller = new AbortController();
      abortRef.current = controller;

      if (!silent && !hasLoadedRef.current) {
        setLoading(true);
      }

      try {
        lastFetchRef.current = Date.now();
        const res = await getDashboardData(periodo, { signal: controller.signal });
        if (controller.signal.aborted) return;
        hasLoadedRef.current = true;
        setData(res || EMPTY_DASHBOARD_DATA);
        setError(null);
      } catch (err) {
        if (err?.name === 'AbortError' || controller.signal.aborted) return;
        console.warn('[useDashboard] Error al cargar datos del dashboard:', err);
        setError(err);
        if (!hasLoadedRef.current) {
          setData(EMPTY_DASHBOARD_DATA);
        }
      } finally {
        if (!controller.signal.aborted) {
          setLoading(false);
        }
      }
    },
    [periodo]
  );

  // Carga inicial y refetch al cambiar el filtro de período
  useEffect(() => {
    fetchDashboard({ silent: hasLoadedRef.current });

    // Refetch periódico cada 45 s (pausado si la pestaña está oculta)
    const intervalId = setInterval(() => {
      if (typeof document !== 'undefined' && document.hidden) return;
      fetchDashboard({ silent: true });
    }, REFRESH_INTERVAL_MS);

    // Refetch al volver a enfocar la pestaña o ventana
    const handleFocusRefresh = () => {
      if (typeof document !== 'undefined' && document.visibilityState === 'hidden') return;
      if (Date.now() - lastFetchRef.current < FOCUS_THROTTLE_MS) return;
      fetchDashboard({ silent: true });
    };

    window.addEventListener('focus', handleFocusRefresh);
    document.addEventListener('visibilitychange', handleFocusRefresh);

    // Cancelar peticiones activas y limpiar listeners al desmontar o cambiar filtro
    return () => {
      clearInterval(intervalId);
      window.removeEventListener('focus', handleFocusRefresh);
      document.removeEventListener('visibilitychange', handleFocusRefresh);
      if (abortRef.current) {
        abortRef.current.abort();
      }
    };
  }, [fetchDashboard]);

  const refresh = useCallback(() => fetchDashboard({ silent: true }), [fetchDashboard]);

  return { data, loading, error, refresh };
}
