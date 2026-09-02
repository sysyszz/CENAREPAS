import { X } from 'lucide-react';

export function ProductoFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-start justify-between gap-4"><h2>Nuevo Producto</h2><button onClick={onClose} className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario"><X className="w-5 h-5" /></button></div>
        <div className="modal-form-grid">
          <div className="modal-field-wide"><label>Nombre del Producto</label><input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label>Categoría</label><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option>Seleccionar categoría</option><option value="1">Arepas Dulces</option><option value="2">Arepas Blancas</option><option value="3">Arepas Rellenas</option><option value="4">Arepas Especiales</option><option value="5">Derivados de Maíz</option></select></div>
          <div><label>Precio</label><input type="number" step="0.01" min="0" required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Stock Inicial</label><input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Descripción</label><textarea rows={3} maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label>Ficha técnica</label><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="">Sin ficha técnica</option><option value="1">Arepa de Chócolo con Queso</option><option value="2">Arepa Telita Tradicional</option></select></div>
          <div><label>Proveedor</label><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="">Sin proveedor</option><option value="1">Agrícola del Valle S.A.</option><option value="2">Lácteos El Campesino</option><option value="3">Plásticos San José Ltda.</option><option value="4">Distribuidora del Campo</option></select></div>
          <div className="modal-field-wide"><label>Imagen URL</label><input type="url" maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Stock mínimo</label><input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Fecha de vencimiento</label><input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Estado</label><select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
          <div className="flex gap-2 pt-4"><button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancelar</button><button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Guardar</button></div>
        </div>
      </div>
    </div>
  );
}
