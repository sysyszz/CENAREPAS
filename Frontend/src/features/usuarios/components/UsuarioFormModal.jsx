import { useState, useEffect, useMemo, useCallback } from 'react';
import { Shield, Mail, Lock, User, CheckCircle2, IdCard, Eye, EyeOff, Check } from 'lucide-react';
import { Combobox } from '../../../shared/ui/Combobox';
import { StepperModal } from '../../../shared/components/StepperModal';
import { getOpcionesComo, conValorActual } from '../../../shared/services/opciones';
import { OPCIONES_TIPO_DOCUMENTO } from '../../../shared/config/negocio';
import {
  CONTRASENA_MIN,
  REGLAS_CONTRASENA,
  validarContrasenaUsuario,
} from '../utils/passwordRules';

const USUARIO_DOCUMENTO_REGEX = /^\d{5,10}$/;

export function UsuarioFormModal({ open, onClose, usuario = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [tipoDocumento, setTipoDocumento] = useState('CC');
  const [documento, setDocumento] = useState('');
  const [idRol, setIdRol] = useState('1');
  const [contrasena, setContrasena] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [estado, setEstado] = useState('Activo');
  const [roles, setRoles] = useState([]);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    getOpcionesComo('roles', 'id_rol')
      .then((data) => {
        if (Array.isArray(data)) setRoles(data);
      })
      .catch(() => {});
  }, []);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      setShowPassword(false);
      if (usuario) {
        setNombre(usuario.nombre || '');
        setCorreo(usuario.correo || '');
        setTipoDocumento(usuario.tipo_documento || 'CC');
        setDocumento(usuario.documento || '');
        setIdRol(usuario.id_rol ? String(usuario.id_rol) : '1');
        setContrasena('');
        setEstado(usuario.estado || 'Activo');
      } else {
        setNombre('');
        setCorreo('');
        setTipoDocumento('CC');
        setDocumento('');
        setIdRol(roles[0]?.id_rol ? String(roles[0].id_rol) : '1');
        setContrasena('');
        setEstado('Activo');
      }
    } else {
      setCurrentStep(0);
      setShowPassword(false);
    }
  }, [usuario, open, roles]);

  const isDirty = useMemo(() => {
    if (!open) return false;
    if (!usuario) {
      return (
        nombre.trim() !== '' ||
        correo.trim() !== '' ||
        tipoDocumento !== 'CC' ||
        documento.trim() !== '' ||
        contrasena.trim() !== ''
      );
    }
    return (
      nombre !== (usuario.nombre || '') ||
      correo !== (usuario.correo || '') ||
      documento !== (usuario.documento || '') ||
      tipoDocumento !== (usuario.tipo_documento || 'CC') ||
      idRol !== String(usuario.id_rol || '1') ||
      estado !== (usuario.estado || 'Activo') ||
      contrasena.trim() !== ''
    );
  }, [open, usuario, nombre, correo, tipoDocumento, documento, idRol, estado, contrasena]);

  const validateStep1 = useCallback(() => {
    if (!nombre.trim()) {
      return 'El nombre completo del usuario es obligatorio.';
    }
    if (nombre.trim().length < 3) {
      return 'El nombre debe contener al menos 3 caracteres.';
    }
    if (!correo.trim()) {
      return 'El correo electrónico es obligatorio.';
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(correo.trim())) {
      return 'Por favor ingresa un correo electrónico válido.';
    }
    if (!tipoDocumento) {
      return 'El tipo de documento es obligatorio.';
    }
    const docLimpio = documento.trim();
    if (!docLimpio) {
      return 'El número de documento es obligatorio.';
    }
    if (!USUARIO_DOCUMENTO_REGEX.test(docLimpio)) {
      return 'El número de documento debe contener entre 5 y 10 dígitos numéricos.';
    }
    return true;
  }, [nombre, correo, tipoDocumento, documento]);

  const validateStep2 = useCallback(() => {
    const clave = contrasena.trim();
    if (!usuario && !clave) {
      return 'La contraseña es obligatoria para nuevos usuarios.';
    }
    if (clave) {
      const errorClave = validarContrasenaUsuario(clave);
      if (errorClave) return errorClave;
    }
    return true;
  }, [usuario, contrasena]);

  const handleSubmit = useCallback(() => {
    const v1 = validateStep1();
    if (v1 !== true) {
      setCurrentStep(0);
      return;
    }
    const v2 = validateStep2();
    if (v2 !== true) {
      setCurrentStep(1);
      return;
    }

    const documentoPayload = {
      tipo_documento: tipoDocumento,
      documento: documento.trim(),
    };

    const payload = usuario
      ? {
          ...usuario,
          nombre: nombre.trim(),
          correo: correo.trim(),
          ...documentoPayload,
          id_rol: Number(idRol) || 1,
          estado,
          ...(contrasena.trim() ? { contrasena_hash: contrasena.trim() } : {}),
        }
      : {
          nombre: nombre.trim(),
          correo: correo.trim(),
          ...documentoPayload,
          id_rol: Number(idRol) || 1,
          estado: estado || 'Activo',
          contrasena_hash: contrasena.trim(),
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  }, [validateStep1, validateStep2, usuario, nombre, correo, tipoDocumento, documento, idRol, estado, contrasena, onSave, onClose]);

  const steps = useMemo(() => [
    {
      id: 'datos-personales',
      title: 'Datos personales',
      description: 'Nombre completo, documento y correo electrónico de contacto',
      validate: validateStep1,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">
          {/* Nombre */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_nombre" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Nombre completo <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="usuario_nombre"
                name="nombre"
                type="text"
                maxLength={100}
                autoFocus
                placeholder="Ej. Juan Carlos Pérez Gómez"
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Nombre y apellido para identificación del usuario en el sistema.
            </p>
          </div>

          {/* Tipo de documento (fila propia, sobre el número) */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_tipo_documento" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Tipo de documento <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <Combobox
              id="usuario_tipo_documento"
              name="tipo_documento"
              value={tipoDocumento}
              onChange={(e) => setTipoDocumento(e.target.value)}
              options={OPCIONES_TIPO_DOCUMENTO}
            />
          </div>

          {/* Número de documento */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_documento" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Número de documento <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <IdCard className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="usuario_documento"
                name="documento"
                type="text"
                inputMode="numeric"
                required
                maxLength={10}
                placeholder="Ej. 1020304050"
                value={documento}
                onChange={(e) => setDocumento(e.target.value.replace(/\D/g, '').slice(0, 10))}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Solo dígitos numéricos (entre 5 y 10 dígitos).
            </p>
          </div>

          {/* Correo */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_correo" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Correo electrónico <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="usuario_correo"
                name="correo"
                type="email"
                maxLength={100}
                placeholder="usuario@cenarepas.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Servirá como identificador único para iniciar sesión y recibir notificaciones.
            </p>
          </div>

          {/* Recuadro de ayuda contextual */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-3 text-xs text-muted-foreground">
            <Shield className="size-4 text-[#C1502D] dark:text-[#E8B23D] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block mb-0.5">Gestión de cuentas</span>
              En el siguiente paso podrás asignar el rol operativo (Administrador, Supervisor, etc.) y establecer las credenciales de seguridad.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'rol-seguridad',
      title: 'Seguridad y Rol',
      description: 'Asignación de rol, estado y contraseña de acceso',
      validate: validateStep2,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">
          {/* Rol */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_id_rol" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Rol del sistema <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <Combobox
              id="usuario_id_rol"
              name="id_rol"
              value={idRol}
              onChange={(e) => setIdRol(e.target.value)}
              options={conValorActual(roles, 'id_rol', usuario?.id_rol, usuario?.rol_nombre).map((r) => ({
                value: String(r.id_rol),
                label: r.nombre,
              }))}
            />
          </div>

          {/* Contraseña */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_contrasena" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Contraseña {usuario ? <span className="text-muted-foreground font-normal text-xs">(Dejar en blanco para conservar actual)</span> : <span className="text-destructive font-bold ml-0.5">*</span>}
            </label>
            <div className="relative">
              <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="usuario_contrasena"
                name="contrasena_hash"
                type={showPassword ? 'text' : 'password'}
                maxLength={255}
                placeholder={usuario ? '••••••••' : `Ej. Clave123*`}
                value={contrasena}
                onChange={(e) => setContrasena(e.target.value)}
                className="w-full h-10 pl-10 pr-10 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
              <button
                type="button"
                onClick={() => setShowPassword((prev) => !prev)}
                className="absolute right-2.5 top-1/2 -translate-y-1/2 p-1 rounded-md text-muted-foreground hover:text-foreground transition-colors cursor-pointer"
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
              </button>
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              {usuario
                ? 'Ingresa una nueva contraseña únicamente si deseas restablecerla.'
                : `Debe tener al menos ${CONTRASENA_MIN} caracteres, una mayúscula, un número y un símbolo.`}
            </p>
            {(!usuario || contrasena.length > 0) && (
              <ul className="mt-2 grid grid-cols-2 gap-x-3 gap-y-1" aria-label="Requisitos de contraseña">
                {REGLAS_CONTRASENA.map((regla) => {
                  const cumple = regla.test(contrasena.trim());
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
            )}
          </div>

          {/* Ayuda contextual de seguridad */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-3 text-xs text-muted-foreground">
            <CheckCircle2 className="size-4 text-[#5A7A3A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block mb-0.5">Control de acceso</span>
              Los permisos específicos asignados a este usuario dependerán automáticamente del rol seleccionado.
            </div>
          </div>
          {/* Estado (fila completa, último campo) */}
          <div className="sm:col-span-2">
            <label htmlFor="usuario_estado" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Estado de la cuenta <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <Combobox
              id="usuario_estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              options={[
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' },
              ]}
            />
          </div>

        </div>
      ),
    },
  ], [nombre, correo, tipoDocumento, documento, idRol, estado, contrasena, showPassword, roles, usuario, validateStep1, validateStep2]);

  return (
    <StepperModal
      isOpen={open}
      onClose={onClose}
      category="USUARIOS"
      title={usuario ? 'Editar Usuario' : 'Nuevo Usuario'}
      subtitle="Gestiona la información y credenciales de acceso del colaborador"
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel={usuario ? 'Guardar Cambios' : 'Crear Usuario'}
      isDirty={isDirty}
    />
  );
}

export default UsuarioFormModal;
