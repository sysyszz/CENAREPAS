import FormModal from '../../../shared/components/FormModal';
import FormField from '../../../shared/components/FormField';

export function ClienteFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Cliente" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <FormField className="modal-field-wide" label="Nombre" htmlFor="cliente-nombre" required>
        <input
          id="cliente-nombre"
          type="text"
          className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          maxLength={150}
          required
        />
      </FormField>
      <FormField label="Documento" htmlFor="cliente-documento" required>
        <input id="cliente-documento" type="text" maxLength={20} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm" />
      </FormField>
      <FormField label="Teléfono" htmlFor="cliente-telefono">
        <input
          id="cliente-telefono"
          type="tel"
          className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          placeholder="+1 234-5678"
        />
      </FormField>
      <FormField className="modal-field-wide" label="Correo" htmlFor="cliente-correo">
        <input
          id="cliente-correo"
          type="email"
          className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          maxLength={150}
        />
      </FormField>
      <FormField className="modal-field-wide" label="Dirección" htmlFor="cliente-direccion">
        <textarea
          id="cliente-direccion"
          rows={2}
          className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring text-sm"
          maxLength={255}
        />
      </FormField>
    </FormModal>
  );
}
