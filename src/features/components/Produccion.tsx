import { useState } from 'react';
import { Plus, Search, Eye, XCircle, Factory } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function Produccion() {
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [lotes, setLotes] = useState([
    { id: 1, codigo: 'LOTE-001', producto: 'Pan Francés', cantidad: 100, fecha: '2026-06-02', estado: 'Completado' },
    { id: 2, codigo: 'LOTE-002', producto: 'Torta de Chocolate', cantidad: 5, fecha: '2026-06-02', estado: 'En Proceso' },
    { id: 3, codigo: 'LOTE-003', producto: 'Croissant', cantidad: 50, fecha: '2026-06-01', estado: 'Completado' },
  ]);

  const handleAnular = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setLotes(lotes.map(l => l.id === deleteDialog.id ? { ...l, estado: 'Anulado' } : l));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Lote anulado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Producción</h1>
          <p className="text-muted-foreground">Gestión de lotes de producción</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Registrar Lote
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <Factory className="w-5 h-5 text-success" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Lotes Hoy</p>
              <h3>2 lotes</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <Factory className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">En Proceso</p>
              <h3>1 lote</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <Factory className="w-5 h-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Producción Total</p>
              <h3>155 unidades</h3>
            </div>
          </div>
        </div>
      </div>

      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="search"
              placeholder="Buscar lote..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todos los estados</option>
            <option>En Proceso</option>
            <option>Completado</option>
            <option>Anulado</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">Código</th>
              <th className="text-left px-6 py-3">Producto</th>
              <th className="text-left px-6 py-3">Cantidad</th>
              <th className="text-left px-6 py-3">Fecha</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {lotes.map((lote) => (
              <tr key={lote.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{lote.codigo}</td>
                <td className="px-6 py-4">{lote.producto}</td>
                <td className="px-6 py-4">{lote.cantidad} unidades</td>
                <td className="px-6 py-4 text-muted-foreground">{lote.fecha}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    lote.estado === 'Completado'
                      ? 'bg-success/10 text-success'
                      : lote.estado === 'En Proceso'
                      ? 'bg-warning/10 text-warning'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {lote.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    {lote.estado !== 'Anulado' && (
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: lote.id, nombre: lote.codigo })}
                        className="p-2 hover:bg-muted rounded-lg text-destructive"
                      >
                        <XCircle className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-2xl">
            <h2 className="mb-4">Registrar Lote de Producción</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Ficha Técnica (Receta)</label>
                <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Seleccionar receta</option>
                  <option>Pan Francés</option>
                  <option>Torta de Chocolate</option>
                  <option>Croissant</option>
                </select>
              </div>
              <div>
                <label className="block mb-2">Cantidad a Producir</label>
                <input type="number" placeholder="Número de unidades" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="p-4 bg-accent/10 rounded-lg">
                <h4 className="mb-2">Insumos Requeridos</h4>
                <div className="space-y-1 text-sm">
                  <p className="text-muted-foreground">Selecciona una receta para ver los insumos necesarios</p>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Cancelar
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  Registrar Lote
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Lote de Producción"
        message={`¿Estás seguro de que deseas anular el lote "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Anular"
        onConfirm={handleAnular}
        onCancel={() => setDeleteDialog({ isOpen: false, id: null, nombre: '' })}
        isLoading={isDeleting}
      />

      <Toast
        isOpen={toast.isOpen}
        type={toast.type}
        message={toast.message}
        onClose={() => setToast({ ...toast, isOpen: false })}
      />
    </div>
  );
}
