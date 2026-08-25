import FormModal from '../../../shared/components/FormModal';

export function ProduccionFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Registrar Lote de Producción" onClose={onClose} onSubmit={onClose} submitLabel="Registrar Lote" cancelLabel="Cancelar">
      <div>
        <label className="block mb-2">Ficha Técnica (Receta)</label>
        <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          <option>Seleccionar receta</option>
          <option value="1">Arepa de Chócolo con Queso</option><option value="2">Arepa Telita Tradicional</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">Cantidad a Producir</label>
        <input type="number" min="0" required placeholder="Cantidad producida" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="block mb-2">Usuario Responsable</label>
        <select required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg">
          <option value="1">Carlos Eduardo Gómez</option>
          <option value="2">María Fernanda Rojas</option>
          <option value="3">Jorge Eliecer Restrepo</option>
          <option value="4">Ana Lucía Benítez</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">Fecha de Producción</label>
        <input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" />
      </div>
      <div className="modal-field-wide">
        <label className="block mb-2">Estado</label>
        <select defaultValue="en_proceso" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg">
          <option value="en_proceso">En proceso</option>
          <option value="finalizado">Finalizado</option>
        </select>
      </div>
      <div className="modal-field-wide">
        <label className="block mb-2">Observaciones</label>
        <textarea maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" />
      </div>
      <div className="p-4 bg-accent/10 rounded-lg">
        <h4 className="mb-2">Insumos Requeridos</h4>
        <div className="space-y-1 text-sm">
          <p className="text-muted-foreground">Selecciona una receta para ver los insumos necesarios</p>
        </div>
      </div>
    </FormModal>
  );
}
