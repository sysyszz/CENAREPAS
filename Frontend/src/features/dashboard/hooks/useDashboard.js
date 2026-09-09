import { useState, useEffect } from 'react';
import { getDashboardData } from '../services/dashboardService';

export function useDashboard() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    getDashboardData().then((res) => {
      if (!active) return;
      setData(res);
      setLoading(false);
    });
    return () => {
      active = false;
    };
  }, []);

  return { data, loading };
}
