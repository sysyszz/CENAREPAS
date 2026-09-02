// configuracionService.js - Servicio para la gestión de configuración general de CENAREPAS
import { DEFAULT_CONFIG } from '../../../shared/contexts/ConfiguracionContext';

const STORAGE_KEY = 'cenarepas_configuracion';

/**
 * Obtiene la configuración actual del sistema.
 * Preparado para reemplazar por fetch('/api/configuracion') en el futuro.
 */
export const getConfiguracion = async () => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      return { ...DEFAULT_CONFIG, ...JSON.parse(saved) };
    }
  } catch (e) {
    console.error('Error al leer configuración del servicio:', e);
  }
  return { ...DEFAULT_CONFIG };
};

/**
 * Guarda y actualiza la configuración del sistema.
 * Preparado para reemplazar por fetch('/api/configuracion', { method: 'PUT', body: ... })
 */
export const saveConfiguracion = async (newConfig) => {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(newConfig));
    return { success: true, data: newConfig };
  } catch (e) {
    console.error('Error al guardar configuración en el servicio:', e);
    throw new Error('No se pudo guardar la configuración');
  }
};

/**
 * Restablece los valores por defecto del sistema.
 */
export const resetConfiguracion = async () => {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return { success: true, data: DEFAULT_CONFIG };
  } catch (e) {
    console.error('Error al restablecer configuración:', e);
    throw new Error('No se pudo restablecer la configuración');
  }
};
