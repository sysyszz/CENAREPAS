import { Plus, X } from 'lucide-react';

export function FichaTecnicaFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-start justify-between gap-4"><h2>Nueva Ficha Técnica</h2><button onClick={onClose} className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario"><X className="w-5 h-5" /></button></div>
        <div className="modal-form-grid">
          <div className="modal-field-wide"><label>Nombre</label><input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Descripción</label><textarea maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Instrucciones de Preparación</label><textarea className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label>Tiempo Estimado (minutos)</label><input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label>Rendimiento por Lote</label><input type="number" min="0" step="0.01" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="modal-field-wide"><label>Insumos Requeridos</label><div className="space-y-2"><div className="flex gap-2"><select className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg"><option>Seleccionar insumo</option><option value="1">Maíz Blanco Trillado</option><option value="2">Maíz Amarillo</option><option value="3">Queso Doble Crema</option></select><input type="number" placeholder="Cantidad" className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg" /><select className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg"><option>kg</option><option>g</option><option>l</option></select><button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"><Plus className="w-5 h-5" /></button></div></div></div>
          <div className="modal-field-wide"><label>Estado</label><select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
          <div className="flex gap-2 pt-4"><button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancelar</button><button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Guardar</button></div>
        </div>
      </div>
    </div>
  );
}
