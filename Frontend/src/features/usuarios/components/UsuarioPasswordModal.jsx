import { useState, useEffect } from 'react';
import { X, Lock, Eye, EyeOff, Check, AlertCircle, KeyRound } from 'lucide-react';
import {
  CONTRASENA_MIN,
  REGLAS_CONTRASENA,
  validarContrasenaUsuario,
} from '../utils/passwordRules';

export function UsuarioPasswordModal({ open, usuario, onClose, onSave, isSaving = false }) {
  const [nuevaContrasena, setNuevaContrasena] = useState('');
  const [confirmacion, setConfirmacion] = useState('');
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (open) {
      setNuevaContrasena('');
      setConfirmacion('');
      setShowNew(false);
      setShowConfirm(false);
      setError('');
    }
  }, [open, usuario]);

  useEffect(() => {
    if (!open) return undefined;
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && !isSaving) onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [open, isSaving, onClose]);

  if (!open || !usuario) return null;

  const claveLimpia = nuevaContrasena.trim();
  const confirmLimpia = confirmacion.trim();
  const coinciden = confirmLimpia.length > 0 && claveLimpia === confirmLimpia;

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    if (!claveLimpia) {
      setError('Ingresa la nueva contraseña.');
      return;
    }
    const errClave = validarContrasenaUsuario(claveLimpia);
    if (errClave) {
      setError(errClave);
      return;
    }
    if (!confirmLimpia) {
      setError('Confirma la nueva contraseña.');
      return;
    }
    if (claveLimpia !== confirmLimpia) {
      setError('Las contraseñas no coinciden.');
      return;
    }

    onSave(usuario, claveLimpia);
  };

  return (
    <div
      className="fixed inset-0 bg-black/60 backdrop-blur-xs flex items-center justify-center z-50 p-4 animate-in fade-in-50 duration-200"
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-cambiar-contrasena-title"
    >
      <div className="bg-card text-card-foreground rounded-2xl max-w-md w-full border border-border shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
        {/* Encabezado */}
        <header className="px-6 pt-5 pb-4 border-b border-border flex items-start justify-between gap-3">
          <div className="flex items-start gap-3 min-w-0">
            <div className="size-10 rounded-xl bg-[#FFE1D0]/70 dark:bg-[#C1502D]/20 text-[#C1502D] dark:text-[#E8B23D] flex items-center justify-center shrink-0">
              <KeyRound className="size-5" />
            </div>
            <div className="min-w-0">
              <span className="text-[10px] font-bold tracking-[0.14em] uppercase text-[#C1502D] dark:text-[#E8B23D] block">
                SEGURIDAD
              </span>
              <h2
                id="modal-cambiar-contrasena-title"
                className="text-lg font-extrabold text-foreground tracking-tight leading-snug"
              >
                Cambiar contraseña
              </h2>
              <p className="text-xs text-muted-foreground mt-0.5 truncate">
                {usuario.nombre} · {usuario.correo}
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            disabled={isSaving}
            className="p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors cursor-pointer disabled:opacity-50"
            aria-label="Cerrar modal"
          >
            <X className="size-5" />
          </button>
        </header>

        {/* Formulario */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div
              className="p-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-xs flex items-start gap-2.5"
              role="alert"
            >
              <AlertCircle className="size-4 shrink-0 mt-0.5" />
              <div className="flex-1 font-medium">{error}</div>
            </div>
          )}

          {/* Nueva contraseña */}
          <div>
            <label htmlFor="cambiar_contrasena_nueva" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Nueva contraseña <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cambiar_contrasena_nueva"
                name="nueva_contrasena"
                type={showNew ? 'text' : 'password'}
                maxLength={255}
                autoFocus
                placeholder="Ej. Clave123*"
                value={nuevaContrasena}
                onChange={(e) => {
                  setNuevaContrasena(e.target.value);
                  if (error) setError('');
                }}
                className="w-full h-10 pl-10 pr-10 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button
                type="button"
                onClick={() => setShowNew((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showNew ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showNew ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Mínimo {CONTRASENA_MIN} caracteres, una mayúscula, un número y un símbolo.
            </p>
            <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1" aria-label="Requisitos de contraseña">
              {REGLAS_CONTRASENA.map((regla) => {
                const cumple = regla.test(claveLimpia);
                return (
                  <li
                    key={regla.id}
                    className={`flex items-center gap-1.5 text-[11px] transition-colors ${
                      cumple
                        ? 'text-emerald-600 dark:text-emerald-400 font-medium'
                        : 'text-muted-foreground'
                    }`}
                  >
                    <span
                      className={`size-3.5 rounded-full flex items-center justify-center shrink-0 border ${
                        cumple
                          ? 'bg-emerald-500/15 border-emerald-500/40 text-emerald-600 dark:text-emerald-400'
                          : 'border-border'
                      }`}
                    >
                      {cumple && <Check className="size-2.5 stroke-[3]" />}
                    </span>
                    <span>{regla.label}</span>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Confirmar contraseña */}
          <div>
            <label htmlFor="cambiar_contrasena_confirmar" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Confirmar contraseña <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cambiar_contrasena_confirmar"
                name="confirmar_contrasena"
                type={showConfirm ? 'text' : 'password'}
                maxLength={255}
                placeholder="Repite la nueva contraseña"
                value={confirmacion}
                onChange={(e) => {
                  setConfirmacion(e.target.value);
                  if (error) setError('');
                }}
                className="w-full h-10 pl-10 pr-10 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button
                type="button"
                onClick={() => setShowConfirm((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showConfirm ? 'Ocultar confirmación' : 'Mostrar confirmación'}
              >
                {showConfirm ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            {confirmLimpia.length > 0 && (
              <p
                className={`text-[11px] mt-1 font-medium ${
                  coinciden ? 'text-emerald-600 dark:text-emerald-400' : 'text-destructive'
                }`}
              >
                {coinciden ? 'Las contraseñas coinciden.' : 'Las contraseñas aún no coinciden.'}
              </p>
            )}
          </div>

          {/* Acciones */}
          <div className="pt-3 border-t border-border flex items-center justify-end gap-2.5">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving}
              className="h-10 px-4 rounded-xl border border-border hover:bg-muted text-foreground text-xs sm:text-sm font-semibold transition-colors cursor-pointer disabled:opacity-50"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className={`h-10 px-5 rounded-full text-white text-xs sm:text-sm font-bold shadow-md shadow-[#C1502D]/25 transition-all cursor-pointer flex items-center gap-2 ${
                isSaving ? 'bg-[#C1502D]/70 cursor-not-allowed' : 'bg-[#C1502D] hover:bg-[#8A3418]'
              }`}
            >
              {isSaving ? (
                <>
                  <span className="size-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Actualizando...</span>
                </>
              ) : (
                <>
                  <KeyRound className="size-4" />
                  <span>Actualizar contraseña</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default UsuarioPasswordModal;
