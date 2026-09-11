// api.js - Centralized HTTP client for CENAREPAS Frontend
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api/v1';

export async function apiRequest(endpoint, options = {}, fallbackFn = null) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  
  // Retrieve token if present
  let token = null;
  try {
    const rawUser = localStorage.getItem('user');
    if (rawUser) {
      const parsed = JSON.parse(rawUser);
      token = parsed.token || null;
    }
    if (!token) {
      token = localStorage.getItem('token');
    }
  } catch (e) {
    // Ignore JSON parse errors
  }

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };

  try {
    const response = await fetch(url, {
      ...options,
      headers,
      body: options.body && typeof options.body === 'object' ? JSON.stringify(options.body) : options.body,
    });

    const data = await response.json().catch(() => null);

    if (!response.ok) {
      const errorMsg = data?.message || `HTTP Error ${response.status}: ${response.statusText}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data?.data !== undefined ? data.data : data;
  } catch (err) {
    if (fallbackFn) {
      console.warn(`[API Notice] Conexión a Backend ${endpoint} falló (${err.message}). Utilizando datos de respaldo locales.`);
      return await fallbackFn();
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, fallbackFn) => apiRequest(endpoint, { method: 'GET' }, fallbackFn),
  post: (endpoint, body, fallbackFn) => apiRequest(endpoint, { method: 'POST', body }, fallbackFn),
  put: (endpoint, body, fallbackFn) => apiRequest(endpoint, { method: 'PUT', body }, fallbackFn),
  patch: (endpoint, body, fallbackFn) => apiRequest(endpoint, { method: 'PATCH', body }, fallbackFn),
  delete: (endpoint, fallbackFn) => apiRequest(endpoint, { method: 'DELETE' }, fallbackFn),
};

export default api;
