import FormModal from '../../../shared/components/FormModal';

export function InsumoFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Insumo" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <div className="modal-field-wide">
        <label className="block mb-2">Nombre del Insumo</label>
        <input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block mb-2">Stock Inicial</label>
          <input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
        </div>
        <div>
          <label className="block mb-2">Unidad</label>
          <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>kg</option><option>g</option><option>l</option><option>ml</option><option>unidad</option>
          </select>
        </div>
      </div>
      <div>
        <label className="block mb-2">Fecha de Vencimiento</label>
        <input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
          <div>
            <label className="block mb-2">Stock Mínimo (Alerta)</label>
            <input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
          </div>
          <div className="modal-field-wide"><label className="block mb-2">Proveedor</label><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="">Sin proveedor</option><option value="1">Agrícola del Valle S.A.</option><option value="2">Lácteos El Campesino</option><option value="3">Plásticos San José Ltda.</option><option value="4">Distribuidora del Campo</option></select></div>
          <div className="modal-field-wide"><label className="block mb-2">Estado</label><select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
              Cancelar
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Guardar
            </button>
          </div>
    </FormModal>
  );
}
