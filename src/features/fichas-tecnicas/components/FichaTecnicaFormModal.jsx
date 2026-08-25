import { Plus } from 'lucide-react';
import FormModal from '../../../shared/components/FormModal';

export function FichaTecnicaFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nueva Ficha Técnica" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <div className="modal-field-wide"><label>Nombre</label><input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
      <div className="modal-field-wide"><label>Descripción</label><textarea maxLength={255} className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
      <div className="modal-field-wide"><label>Instrucciones de Preparación</label><textarea className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
      <div><label>Tiempo Estimado (minutos)</label><input type="number" min="0" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
      <div><label>Rendimiento por Lote</label><input type="number" min="0" step="0.01" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg" /></div>
      <div className="modal-field-wide"><label>Insumos Requeridos</label><div className="space-y-2"><div className="flex gap-2"><select className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg"><option>Seleccionar insumo</option><option value="1">Maíz Blanco Trillado</option><option value="2">Maíz Amarillo</option><option value="3">Queso Doble Crema</option></select><input type="number" placeholder="Cantidad" className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg" /><select className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg"><option>kg</option><option>g</option><option>l</option></select><button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg"><Plus className="w-5 h-5" /></button></div></div></div>
      <div className="modal-field-wide"><label>Estado</label><select defaultValue="activo" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg"><option value="activo">Activo</option><option value="inactivo">Inactivo</option></select></div>
    </FormModal>
  );
}
