import { useState, useEffect } from 'react';
import { Plus, Trash2, X, Package } from 'lucide-react';
import { mockInsumos, getInsumos } from '../../insumos/services/insumosService';
import { mockFichaTecnicaInsumos } from '../services/fichasTecnicasService';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../../shared/ui/select';

export function FichaTecnicaFormModal({ open, onClose, ficha = null, onSave, isLoading = false }) {
  const [nombre, setNombre] = useState('');
  const [descripcion, setDescripcion] = useState('');
  const [instrucciones, setInstrucciones] = useState('');
  const [tiempo, setTiempo] = useState('');
  const [rendimiento, setRendimiento] = useState('');
  const [estado, setEstado] = useState('Activo');

  // Insumos disponibles y requeridos para la receta
  const [availableInsumos, setAvailableInsumos] = useState(mockInsumos);
  const [insumosRequeridos, setInsumosRequeridos] = useState([]);
  const [selectedInsumoId, setSelectedInsumoId] = useState('');
  const [cantidadInsumo, setCantidadInsumo] = useState('');

  useEffect(() => {
    getInsumos().then((data) => {
      if (data && data.length > 0) setAvailableInsumos(data);
    });
  }, []);

  useEffect(() => {
    if (ficha) {
      setNombre(ficha.nombre || '');
      setDescripcion(ficha.descripcion || '');
      setInstrucciones(ficha.instrucciones_preparacion || '');
      setTiempo(ficha.tiempo_estimado_minutos != null ? String(ficha.tiempo_estimado_minutos) : '');
      setRendimiento(ficha.rendimiento_lote != null ? String(ficha.rendimiento_lote) : '');
      const isInactive = String(ficha.estado ?? '').toLowerCase() === 'inactivo';
      setEstado(isInactive ? 'Inactivo' : 'Activo');

      // Cargar insumos asociados a esta ficha
      const existingInsumos = mockFichaTecnicaInsumos.filter((fi) => fi.id_ficha === ficha.id_ficha);
      if (existingInsumos.length > 0) {
        setInsumosRequeridos(
          existingInsumos.map((item) => {
            const insumoData = availableInsumos.find((i) => i.id_insumo === item.id_insumo);
            return {
              id_insumo: item.id_insumo,
              nombre: insumoData?.nombre || `Insumo #${item.id_insumo}`,
              cantidad: item.cantidad,
              unidad_medida: item.unidad_medida || insumoData?.unidad_medida || 'kg',
            };
          })
        );
      } else {
        setInsumosRequeridos([]);
      }
    } else {
      setNombre('');
      setDescripcion('');
      setInstrucciones('');
      setTiempo('');
      setRendimiento('');
      setEstado('Activo');
      setInsumosRequeridos([]);
    }
    setSelectedInsumoId('');
    setCantidadInsumo('');
  }, [ficha, open, availableInsumos]);

  if (!open) return null;

  const handleAddInsumo = () => {
    if (!selectedInsumoId || !cantidadInsumo || Number(cantidadInsumo) <= 0) return;

    const insumoObj = availableInsumos.find((i) => String(i.id_insumo) === String(selectedInsumoId));
    if (!insumoObj) return;

    // Si ya existe en la lista, actualizar cantidad
    const existingIndex = insumosRequeridos.findIndex((i) => String(i.id_insumo) === String(selectedInsumoId));
    if (existingIndex >= 0) {
      const updated = [...insumosRequeridos];
      updated[existingIndex].cantidad = Number(cantidadInsumo);
      setInsumosRequeridos(updated);
    } else {
      setInsumosRequeridos([
        ...insumosRequeridos,
        {
          id_insumo: insumoObj.id_insumo,
          nombre: insumoObj.nombre,
          cantidad: Number(cantidadInsumo),
          unidad_medida: insumoObj.unidad_medida || 'kg',
        },
      ]);
    }

    setSelectedInsumoId('');
    setCantidadInsumo('');
  };

  const handleRemoveInsumo = (idToRemove) => {
    setInsumosRequeridos(insumosRequeridos.filter((i) => i.id_insumo !== idToRemove));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!nombre.trim()) return;

    const payload = ficha
      ? {
          ...ficha,
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          instrucciones_preparacion: instrucciones.trim(),
          tiempo_estimado_minutos: Number(tiempo) || 0,
          rendimiento_lote: Number(rendimiento) || 0,
          insumos: insumosRequeridos,
          estado,
        }
      : {
          nombre: nombre.trim(),
          descripcion: descripcion.trim(),
          instrucciones_preparacion: instrucciones.trim(),
          tiempo_estimado_minutos: Number(tiempo) || 0,
          rendimiento_lote: Number(rendimiento) || 0,
          insumos: insumosRequeridos,
          estado,
        };

    if (onSave) {
      onSave(payload);
    } else {
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-xs flex items-center justify-center z-50 p-4">
      <div className="form-modal-panel bg-card text-card-foreground p-6 rounded-xl max-w-xl w-full border border-border shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto custom-scrollbar animate-in fade-in-50 zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-start justify-between gap-4 pb-2 border-b border-border">
          <div>
            <h2 className="text-xl font-bold">{ficha ? 'Editar Ficha Técnica' : 'Nueva Ficha Técnica'}</h2>
            <p className="text-xs text-muted-foreground mt-0.5">
              Define la formulación, tiempos e insumos requeridos para la receta
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 rounded-lg hover:bg-muted text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Cerrar formulario"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="modal-form-grid space-y-4">
          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Nombre de la Receta / Ficha *</label>
            <input
              type="text"
              maxLength={100}
              required
              placeholder="Ej. Arepa Telita Tradicional"
              value={nombre}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Descripción</label>
            <textarea
              maxLength={255}
              rows={2}
              placeholder="Breve resumen de la receta y características..."
              value={descripcion}
              onChange={(e) => setDescripcion(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block mb-1.5 text-sm font-medium">Tiempo Estimado (min)</label>
              <input
                type="number"
                min="0"
                placeholder="Ej. 45"
                value={tiempo}
                onChange={(e) => setTiempo(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
            <div>
              <label className="block mb-1.5 text-sm font-medium">Rendimiento por Lote (unidades)</label>
              <input
                type="number"
                min="0"
                step="1"
                placeholder="Ej. 100"
                value={rendimiento}
                onChange={(e) => setRendimiento(e.target.value)}
                className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
              />
            </div>
          </div>

          {/* Sección de Insumos Requeridos con Select Radix UI */}
          <div className="modal-field-wide space-y-3 p-4 rounded-xl border border-border bg-muted/20">
            <div>
              <h4 className="text-sm font-semibold text-foreground flex items-center gap-1.5">
                <Package className="w-4 h-4 text-primary" />
                Insumos Requeridos
              </h4>
              <p className="text-xs text-muted-foreground mt-0.5">
                Agrega las materias primas e insumos necesarios para esta formulación
              </p>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <div className="flex-1">
                <Select value={selectedInsumoId} onValueChange={setSelectedInsumoId}>
                  <SelectTrigger className="w-full bg-input-background">
                    <SelectValue placeholder="Seleccionar insumo..." />
                  </SelectTrigger>
                  <SelectContent className="z-[100] max-h-56">
                    {availableInsumos.map((ins) => (
                      <SelectItem key={ins.id_insumo} value={String(ins.id_insumo)}>
                        {ins.nombre} ({ins.unidad_medida})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="flex gap-2 sm:w-56">
                <input
                  type="number"
                  min="0.01"
                  step="0.01"
                  placeholder="Cantidad"
                  value={cantidadInsumo}
                  onChange={(e) => setCantidadInsumo(e.target.value)}
                  className="w-full px-3 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                />
                <button
                  type="button"
                  onClick={handleAddInsumo}
                  disabled={!selectedInsumoId || !cantidadInsumo}
                  className="px-3.5 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-xs font-semibold flex items-center gap-1 shrink-0 transition-opacity"
                >
                  <Plus className="w-3.5 h-3.5" />
                  Agregar
                </button>
              </div>
            </div>

            {/* Lista de Insumos añadidos */}
            {insumosRequeridos.length > 0 ? (
              <div className="divide-y divide-border border border-border rounded-lg bg-card overflow-hidden">
                {insumosRequeridos.map((item) => (
                  <div key={item.id_insumo} className="flex items-center justify-between p-2.5 text-xs">
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-primary" />
                      <span className="font-medium text-foreground">{item.nombre}</span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-semibold text-foreground px-2 py-0.5 bg-muted rounded">
                        {item.cantidad} {item.unidad_medida}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleRemoveInsumo(item.id_insumo)}
                        className="text-muted-foreground hover:text-destructive p-1 rounded transition-colors"
                        title="Eliminar insumo"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-3 border border-dashed border-border rounded-lg text-xs text-muted-foreground">
                No has agregado ningún insumo a esta receta.
              </div>
            )}
          </div>

          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Instrucciones de Preparación</label>
            <textarea
              rows={3}
              placeholder="Paso a paso del proceso de mezclado, amasado, formado y cocción..."
              value={instrucciones}
              onChange={(e) => setInstrucciones(e.target.value)}
              className="w-full px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>

          <div className="modal-field-wide">
            <label className="block mb-1.5 text-sm font-medium">Estado</label>
            <Select value={estado} onValueChange={setEstado}>
              <SelectTrigger className="w-full bg-input-background">
                <SelectValue />
              </SelectTrigger>
              <SelectContent className="z-[100]">
                <SelectItem value="Activo">Activo / Vigente</SelectItem>
                <SelectItem value="Inactivo">Inactivo / En Revisión</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-2 pt-4 border-t border-border">
            <button
              type="button"
              onClick={onClose}
              disabled={isLoading}
              className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 disabled:opacity-50 text-sm font-medium transition-colors shadow-xs"
            >
              {isLoading ? 'Guardando...' : ficha ? 'Guardar Cambios' : 'Guardar Ficha'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
