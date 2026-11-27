// Reglas de contraseña del módulo de usuarios (coinciden con Backend/src/services/usuarios.service.js).
export const CONTRASENA_MIN = 8;

export const REGLAS_CONTRASENA = [
  { id: 'min', label: `Mínimo ${CONTRASENA_MIN} caracteres`, test: (v) => v.length >= CONTRASENA_MIN },
  { id: 'mayus', label: 'Al menos 1 mayúscula', test: (v) => /[A-Z]/.test(v) },
  { id: 'num', label: 'Al menos 1 número', test: (v) => /\d/.test(v) },
  { id: 'simb', label: 'Al menos 1 símbolo', test: (v) => /[^A-Za-z0-9\s]/.test(v) },
];

export function validarContrasenaUsuario(valor) {
  const clave = String(valor || '').trim();
  if (clave.length < CONTRASENA_MIN) {
    return `La contraseña debe tener al menos ${CONTRASENA_MIN} caracteres.`;
  }
  const faltantes = [];
  if (!/[A-Z]/.test(clave)) faltantes.push('una mayúscula');
  if (!/\d/.test(clave)) faltantes.push('un número');
  if (!/[^A-Za-z0-9\s]/.test(clave)) faltantes.push('un símbolo');
  if (faltantes.length > 0) {
    const detalle = faltantes.length === 1
      ? faltantes[0]
      : `${faltantes.slice(0, -1).join(', ')} y ${faltantes[faltantes.length - 1]}`;
    return `La contraseña debe incluir al menos ${detalle}.`;
  }
  return null;
}
