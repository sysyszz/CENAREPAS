import { useState, useEffect, useMemo, useCallback } from 'react';
import { Building2, Phone, Mail, MapPin, FileText } from 'lucide-react';
import { Combobox } from '../../../shared/ui/Combobox';
import { StepperModal } from '../../../shared/components/StepperModal';

export function ProveedorFormModal({ open, onClose, proveedor = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [nit, setNit] = useState('');
  const [telefono, setTelefono] = useState('');
  const [correo, setCorreo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [estado, setEstado] = useState('Activo');
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (open) {
      setCurrentStep(0);
      if (proveedor) {
        setNombre(proveedor.nombre || '');
        setNit(proveedor.nit || '');
        setTelefono(proveedor.telefono || '');
        setCorreo(proveedor.correo || '');
        setDireccion(proveedor.direccion || '');
        setEstado(proveedor.estado || 'Activo');
      } else {
        setNombre('');
        setNit('');
        setTelefono('');
        setCorreo('');
        setDireccion('');
        setEstado('Activo');
      }
    } else {
      setCurrentStep(0);
    }
  }, [proveedor, open]);

  const isDirty = useMemo(() => {
    if (!open) return false;
    if (!proveedor) {
      return nombre.trim() !== '' || nit.trim() !== '' || telefono.trim() !== '' || correo.trim() !== '';
    }
    return (
      nombre !== (proveedor.nombre || '') ||
      nit !== (proveedor.nit || '') ||
      telefono !== (proveedor.telefono || '') ||
      correo !== (proveedor.correo || '') ||
      direccion !== (proveedor.direccion || '') ||
      estado !== (proveedor.estado || 'Activo')
    );
  }, [open, proveedor, nombre, nit, telefono, correo, direccion, estado]);

  const validateStep1 = useCallback(() => {
    if (!nombre.trim()) {
      return 'El nombre o razón social del proveedor es obligatorio.';
    }
    if (nombre.trim().length < 3) {
      return 'El nombre debe tener al menos 3 caracteres.';
    }
    if (!nit.trim()) {
      return 'El NIT o documento de identificación es obligatorio.';
    }
    return true;
  }, [nombre, nit]);

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

    const payload = proveedor
      ? {
          ...proveedor,
          nombre: nombre.trim(),
          nit: nit.trim(),
          telefono: telefono.trim() || null,
          correo: correo.trim() || null,
          direccion: direccion.trim() || null,
          estado,
        }
      : {
          nombre: nombre.trim(),
          nit: nit.trim(),
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
  }, [validateStep1, validateStep2, proveedor, nombre, nit, telefono, correo, direccion, estado, onSave, onClose]);

  const steps = useMemo(() => [
    {
      id: 'datos-empresa',
      title: 'Datos de empresa',
      description: 'Razón social, identificación fiscal y estado',
      validate: validateStep1,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">
          {/* Nombre / Razón Social */}
          <div className="sm:col-span-2">
            <label htmlFor="proveedor_nombre" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Nombre o Razón Social <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <Building2 className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="proveedor_nombre"
                name="nombre"
                type="text"
                maxLength={150}
                autoFocus
                placeholder="Ej. Distribuidora de Maíz El Sol S.A.S."
                value={nombre}
                onChange={(e) => setNombre(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Nombre legal o comercial registrado ante la autoridad tributaria.
            </p>
          </div>

          {/* NIT */}
          <div className="sm:col-span-1">
            <label htmlFor="proveedor_nit" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              NIT / Cédula <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <div className="relative">
              <FileText className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="proveedor_nit"
                name="nit"
                type="text"
                maxLength={20}
                placeholder="Ej. 900.123.456-7"
                value={nit}
                onChange={(e) => setNit(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Estado */}
          <div className="sm:col-span-1">
            <label htmlFor="proveedor_estado" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Estado <span className="text-destructive font-bold ml-0.5">*</span>
            </label>
            <Combobox
              id="proveedor_estado"
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
            <Building2 className="size-4 text-[#C1502D] dark:text-[#E8B23D] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block mb-0.5">Gestión de proveedores</span>
              En el siguiente paso podrás registrar la información de contacto y la ubicación de despacho o bodegas.
            </div>
          </div>
        </div>
      ),
    },
    {
      id: 'contacto-sede',
      title: 'Contacto y sede',
      description: 'Canales de comunicación y dirección de despacho',
      validate: validateStep2,
      content: (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-5 gap-y-4 items-start">
          {/* Teléfono */}
          <div className="sm:col-span-1">
            <label htmlFor="proveedor_telefono" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Teléfono de contacto
            </label>
            <div className="relative">
              <Phone className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="proveedor_telefono"
                name="telefono"
                type="tel"
                maxLength={20}
                placeholder="+57 310 123 4567"
                value={telefono}
                onChange={(e) => setTelefono(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Correo */}
          <div className="sm:col-span-1">
            <label htmlFor="proveedor_correo" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Correo electrónico
            </label>
            <div className="relative">
              <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="proveedor_correo"
                name="correo"
                type="email"
                maxLength={150}
                placeholder="ventas@proveedor.com"
                value={correo}
                onChange={(e) => setCorreo(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
          </div>

          {/* Dirección */}
          <div className="sm:col-span-2">
            <label htmlFor="proveedor_direccion" className="block text-xs sm:text-sm font-semibold text-foreground mb-1.5">
              Dirección de la sede / bodega
            </label>
            <div className="relative">
              <MapPin className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-muted-foreground pointer-events-none" />
              <input
                id="proveedor_direccion"
                name="direccion"
                type="text"
                maxLength={255}
                placeholder="Ej. Carrera 5 # 18-40, Zona Industrial"
                value={direccion}
                onChange={(e) => setDireccion(e.target.value)}
                className="w-full h-10 pl-10 pr-4 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-all"
              />
            </div>
            <p className="text-[11px] text-muted-foreground mt-1">
              Dirección para remisiones y despachos de compras.
            </p>
          </div>

          {/* Ayuda contextual */}
          <div className="sm:col-span-2 p-3.5 rounded-xl bg-muted/40 border border-border/60 flex items-start gap-3 text-xs text-muted-foreground">
            <MapPin className="size-4 text-[#5A7A3A] shrink-0 mt-0.5" />
            <div>
              <span className="font-semibold text-foreground block mb-0.5">Disponibilidad en compras</span>
              Los proveedores activos podrán ser seleccionados directamente en el módulo de compras para registrar órdenes y abastecimiento.
            </div>
          </div>
        </div>
      ),
    },
  ], [nombre, nit, estado, telefono, correo, direccion, validateStep1, validateStep2]);

  return (
    <StepperModal
      isOpen={open}
      onClose={onClose}
      category="COMPRAS"
      title={proveedor ? 'Editar Proveedor' : 'Nuevo Proveedor'}
      subtitle="Gestiona la información comercial y de contacto del proveedor"
      steps={steps}
      currentStep={currentStep}
      onStepChange={setCurrentStep}
      onSubmit={handleSubmit}
      isLoading={isLoading}
      submitLabel={proveedor ? 'Guardar Cambios' : 'Crear Proveedor'}
      isDirty={isDirty}
    />
  );
}

export default ProveedorFormModal;
