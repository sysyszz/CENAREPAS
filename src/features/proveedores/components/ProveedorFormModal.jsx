import FormModal from '../../../shared/components/FormModal';

export function ProveedorFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Proveedor" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <div className="modal-field-wide">
        <label className="block mb-2">Nombre</label>
        <input type="text" maxLength={150} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="block mb-2">NIT</label>
        <input type="text" maxLength={20} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="block mb-2">Teléfono</label>
        <input type="tel" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="modal-field-wide">
        <label className="block mb-2">Correo</label>
        <input type="email" maxLength={150} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="modal-field-wide">
        <label className="block mb-2">Dirección</label>
        <input type="text" maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="modal-field-wide">
        <label className="block mb-2">Estado</label>
        <select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </div>
    </FormModal>
  );
}
