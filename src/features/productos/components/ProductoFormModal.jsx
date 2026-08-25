import FormModal from '../../../shared/components/FormModal';

export function ProductoFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Producto" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
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
    </FormModal>
  );
}
