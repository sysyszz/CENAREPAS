// profileService.js - Servicio para datos de perfil y seguridad
export const getProfile = async () => {
  return {
    nombre: 'Administrador Sistema',
    email: 'admin@sistema.com',
    telefono: '+1 234-567-8900',
    cargo: 'Administrador General',
    fechaCreacion: '15 Enero 2024',
    ultimoAcceso: '3 Junio 2026 - 10:30 AM',
  };
};

export const updateProfile = async (profileData) => {
  return { success: true, data: profileData };
};

export const changePassword = async (passwordData) => {
  return { success: true };
};

export const getActiveSessions = async () => {
  return [
    { id: 1, dispositivo: 'Chrome en Windows', ubicacion: 'New York, USA', fecha: 'Ahora', actual: true },
    { id: 2, dispositivo: 'Safari en iPhone', ubicacion: 'Los Angeles, USA', fecha: 'Hace 2 días', actual: false },
    { id: 3, dispositivo: 'Firefox en macOS', ubicacion: 'Miami, USA', fecha: 'Hace 5 días', actual: false },
  ];
};
