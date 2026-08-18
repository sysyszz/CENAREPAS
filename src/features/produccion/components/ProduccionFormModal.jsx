export function ProduccionFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-card p-6 rounded-lg w-full max-w-2xl">
        <h2 className="mb-4">Registrar Lote de Producción</h2>
        <div className="space-y-4">
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
          <div><label className="block mb-2">Usuario Responsable ID</label><input type="number" min="1" required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div><div><label className="block mb-2">Fecha de Producción</label><input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div><div><label className="block mb-2">Estado</label><select defaultValue="en_proceso" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="en_proceso">En proceso</option><option value="finalizado">Finalizado</option></select></div><div><label className="block mb-2">Observaciones</label><textarea maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="p-4 bg-accent/10 rounded-lg">
            <h4 className="mb-2">Insumos Requeridos</h4>
            <div className="space-y-1 text-sm">
              <p className="text-muted-foreground">Selecciona una receta para ver los insumos necesarios</p>
            </div>
          </div>
          <div className="flex gap-2 pt-4">
            <button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
              Cancelar
            </button>
            <button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
              Registrar Lote
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
