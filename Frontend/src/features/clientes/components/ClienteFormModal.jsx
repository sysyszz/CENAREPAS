import { useState, useEffect, useMemo, useCallback } from 'react';
import { User, FileText, Phone, Mail, MapPin } from 'lucide-react';
import { Combobox } from '../../../shared/ui/Combobox';
import { StepperModal } from '../../../shared/components/StepperModal';

export function ClienteFormModal({ open, onClose, cliente = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [documento, setDocumento] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      if (cliente) {
        setNombre(cliente.nombre || '');
        setDocumento(cliente.documento || '');
        setTelefono(cliente.telefono || '');
        setCorreo(cliente.correo || '');
        setDireccion(cliente.direccion || '');
        const isInactive = String(cliente.estado ?? '').toLowerCase() === 'inactivo';
        setEstado(isInactive ? 'Inactivo' : 'Activo');
      } else {
        setNombre('');
        setDocumento('');
        setTelefono('');
        setCorreo('');
        setDireccion('');
        setEstado('Activo');
      }
    } else {
      setCurrentStep(0);
    }
  }, [cliente, open]);

  const isDirty = useMemo(() => {
    if (!open) return false;
    if (!cliente) {
      return nombre.trim() !== '' || documento.trim() !== '' || telefono.trim() !== '' || correo.trim() !== '';
    }
    return (
      nombre !== (cliente.nombre || '') ||
      documento !== (cliente.documento || '') ||
      telefono !== (cliente.telefono || '') ||
      correo !== (cliente.correo || '') ||
      direccion !== (cliente.direccion || '') ||
      estado !== (cliente.estado || 'Activo')
    );
  }, [open, cliente, nombre, documento, telefono, correo, direccion, estado]);

  const validateStep1 = useCallback(() => {
    if (!nombre.trim()) {
      return 'El nombre o razón social del cliente es obligatorio.';
    }
    if (nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!documento.trim()) {
      return 'El documento, cédula o NIT es obligatorio.';
    }
    return true;
  }, [nombre, documento]);

  const validateStep2 = useCallback(() => {
    if (correo.trim()) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(correo.trim())) {
        return 'El correo electrónico no tiene un formato válido.';
      }
    }
    return true;
  }, [correo]);

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

    const payload = cliente
      ? {
          ...cliente,
          nombre: nombre.trim(),
          documento: documento.trim(),
          telefono: telefono.trim() || null,
          correo: correo.trim() || null,
          direccion: direccion.trim() || null,
          estado,
        }
      : {
          nombre: nombre.trim(),
          documento: documento.trim(),
          telefono: telefono.trim() || null,
          correo: correo.trim() || null,
          direccion: direccion.trim() || null,
          estado: estado || 'Activo',
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  }, [validateStep1, validateStep2, cliente, nombre, documento, telefono, correo, direccion, estado, onSave, onClose]);

  const steps = useMemo(() => [
    {
      id: 'datos-cliente',
      title: 'Datos del cliente',
      description: 'Nombre completo o razón social, documento y estado',
      validate: validateStep1,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">
          {/* Nombre / Razón Social */}
          <div className="sm:col-span-2">
            <label htmlFor="cliente_nombre" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Nombre o Razón Social <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <User className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cliente_nombre"
                name="nombre"
                type="text"
                maxLength={150}
                autoFocus
                placeholder="Ej. Restaurante Sabor Paisa, Tienda Doña Rosa..."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Nombre del establecimiento comercial o cliente particular.
            </p>
          </div>

          {/* Documento */}
          <div className="sm:col-span-1">
            <label htmlFor="cliente_documento" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Cédula / NIT <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cliente_documento"
                name="documento"
                type="text"
                maxLength={20}
                placeholder="Ej. 1098765432 ó 901.234.567-8"
                value={documento}
                onChange={(e) => setDocumento(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Estado */}
          <div className="sm:col-span-1">
            <label htmlFor="cliente_estado" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Estado comercial <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <Combobox
              id="cliente_estado"
              name="estado"
              value={estado}
              onChange={(e) => setEstado(e.target.value)}
              options={[
                { value: 'Activo', label: 'Activo' },
                { value: 'Inactivo', label: 'Inactivo' },
              ]}
            />
          </div>

          {/* Ayuda contextual */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-3 text-xs text-muted-foreground">
            <User className="size-4 text-[#C1502D] dark:text-[#E8B23D] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block mb-0.5">Perfil del cliente</span>
              En el siguiente paso podrás registrar los canales de contacto y la dirección habitual de entrega de pedidos.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contacto-despacho',
      title: 'Contacto y despacho',
      description: 'Teléfono, correo y dirección de entrega de pedidos',
      validate: validateStep2,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">
          {/* Teléfono */}
          <div className="sm:col-span-1">
            <label htmlFor="cliente_telefono" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Teléfono / WhatsApp
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cliente_telefono"
                name="telefono"
                type="tel"
                maxLength={20}
                placeholder="+57 300 123 4567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="sm:col-span-1">
            <label htmlFor="cliente_correo" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Correo de facturación
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cliente_correo"
                name="correo"
                type="email"
                maxLength={150}
                placeholder="pedidos@cliente.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="sm:col-span-2">
            <label htmlFor="cliente_direccion" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Dirección de entrega de pedidos
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="cliente_direccion"
                name="direccion"
                type="text"
                maxLength={255}
                placeholder="Ej. Calle 42 # 5-10, Barrio Belén"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Dirección utilizada por defecto para la logística de despachos y repartos.
            </p>
          </div>

          {/* Ayuda contextual */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-3 text-xs text-muted-foreground">
            <MapPin className="size-4 text-[#5A7A3A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block mb-0.5">Integración con Pedidos y Ventas</span>
              Este cliente estará disponible de inmediato para emitir facturas en mostrador y registrar órdenes de despacho.
            </div>
          </div>
        </div>
      ),
    },
  ], [nombre, documento, estado, telefono, correo, direccion, validateStep1, validateStep2]);

  return (
    <StepperModal
      isOpen={open}
      onClose={onClose}
      category="CLIENTES"
      title={cliente ? 'Editar Cliente' : 'Nuevo Cliente'}
      subtitle="Gestiona los datos comerciales y ubicación de entrega del cliente"
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel={cliente ? 'Guardar Cambios' : 'Crear Cliente'}
      isDirty={isDirty}
    />
  );
}

export default ClienteFormModal;
