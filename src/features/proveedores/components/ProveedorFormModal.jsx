import FormModal from '../../../shared/components/FormModal';
import FormField from '../../../shared/components/FormField';

export function ProveedorFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Proveedor" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <FormField className="modal-field-wide" label="Nombre" htmlFor="proveedor-nombre" required>
        <input id="proveedor-nombre" type="text" maxLength={150} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField label="NIT" htmlFor="proveedor-nit" required>
        <input id="proveedor-nit" type="text" maxLength={20} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField label="Teléfono" htmlFor="proveedor-telefono">
        <input id="proveedor-telefono" type="tel" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField className="modal-field-wide" label="Correo" htmlFor="proveedor-correo">
        <input id="proveedor-correo" type="email" maxLength={150} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField className="modal-field-wide" label="Dirección" htmlFor="proveedor-direccion">
        <input id="proveedor-direccion" type="text" maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField className="modal-field-wide" label="Estado" htmlFor="proveedor-estado">
        <select id="proveedor-estado" defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </FormField>
    </FormModal>
  );
}
