import { toast as sonnerToast } from 'sonner';

/**
 * CenArepas Unified Toast Notification Service
 * Paleta de colores institucional:
 * - Éxito: Verde Hoja (#5A7A3A)
 * - Error: Terracota Oscuro (#C1502D)
 * - Advertencia: Maíz Dorado (#E8B23D)
 * - Info: Azul / Neutro (#2E5B82)
 */

export const toast = {
  success: (message, options = {}) => {
    return sonnerToast.success(message, {
      duration: 3500,
      ...options,
    });
  },

  error: (message = 'No se pudo completar la acción', options = {}) => {
    return sonnerToast.error(message, {
      duration: 4000,
      ...options,
    });
  },

  warning: (message, options = {}) => {
    return sonnerToast.warning(message, {
      duration: 3500,
      ...options,
    });
  },

  info: (message, options = {}) => {
    return sonnerToast.info(message, {
      duration: 3500,
      ...options,
    });
  },

  dismiss: (id) => sonnerToast.dismiss(id),
};

export default toast;
