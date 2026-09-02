import { Plus, X } from 'lucide-react';

export function PedidoFormModal({ open, onClose }) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="form-modal-panel bg-card p-6 rounded-lg">
        <div className="flex items-start justify-between gap-4"><h2>Nuevo Pedido</h2><button onClick={onClose} className="p-2 -mr-2 -mt-2 rounded-lg hover:bg-muted text-muted-foreground" aria-label="Cerrar formulario"><X className="w-5 h-5" /></button></div>
        <div className="modal-form-grid">
          <div><label>Cliente</label><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option>Seleccionar cliente</option><option value="1">Supermercados Mercacentro S.A.</option><option value="2">Tiendas D1 Regional Tolima</option></select></div>
          <div><label>Fecha de Entrega</label><input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label>Sede ID</label><input type="number" min="1" required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div><label>Usuario</label><select required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="1">Carlos Eduardo Gómez</option><option value="2">María Fernanda Rojas</option><option value="3">Jorge Eliecer Restrepo</option><option value="4">Ana Lucía Benítez</option></select></div>
          <div className="modal-field-wide order-products-section"><label>Productos</label><div className="order-product-row"><select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option>Seleccionar producto</option><option value="1">Arepa de Chócolo con Queso</option><option value="2">Arepa Telita Tradicional</option><option value="3">Arepa con Queso Doble Crema</option><option value="4">Arepa Santandereana</option><option value="5">Peto Cocido Congelado</option></select><input type="number" placeholder="Cantidad" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /><input type="number" placeholder="Precio" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /><button className="order-product-add px-4 py-2 bg-primary text-primary-foreground rounded-lg" aria-label="Agregar producto"><Plus className="w-5 h-5" /></button></div></div>
          <div><label>Valor Total</label><input type="number" min="0" step="0.01" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div><div><label>Total</label><input type="text" value="pendiente" disabled className="w-full px-4 py-2 border border-input bg-muted rounded-lg" /></div>
          <div><label>Observaciones</label><textarea maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div><div><label>Motivo de Anulación</label><textarea maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
          <div className="flex gap-2 pt-4"><button onClick={onClose} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">Cancelar</button><button onClick={onClose} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">Crear Pedido</button></div>
        </div>
      </div>
    </div>
  );
}
