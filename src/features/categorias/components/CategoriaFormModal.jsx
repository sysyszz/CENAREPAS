import FormModal from '../../../shared/components/FormModal';
import FormField from '../../../shared/components/FormField';

export function CategoriaFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nueva Categoría" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <FormField className="modal-field-wide" label="Nombre de la Categoría" htmlFor="categoria-nombre" required>
        <input id="categoria-nombre" type="text" maxLength={80} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField className="modal-field-wide" label="Descripción" htmlFor="categoria-descripcion">
        <textarea id="categoria-descripcion" rows={3} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"></textarea>
      </FormField>
      <FormField className="modal-field-wide" label="Estado" htmlFor="categoria-estado">
        <select id="categoria-estado" defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          <option value="activo">Activo</option>
          <option value="inactivo">Inactivo</option>
        </select>
      </FormField>
    </FormModal>
  );
}
