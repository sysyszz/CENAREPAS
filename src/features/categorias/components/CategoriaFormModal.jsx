import FormModal from '../../../shared/components/FormModal';

export function CategoriaFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nueva Categoría" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <div className="modal-field-wide">
        <label className="block mb-2">Nombre de la Categoría</label>
        <input type="text" maxLength={80} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="modal-field-wide">
        <label className="block mb-2">Descripción</label>
        <textarea rows={3} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
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
