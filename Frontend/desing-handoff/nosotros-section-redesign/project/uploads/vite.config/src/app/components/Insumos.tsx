import { useState } from 'react';
import { Plus, Search, Edit, Trash2, AlertTriangle, Clock } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function Insumos() {
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [insumos, setInsumos] = useState([
    { id: 1, nombre: 'Harina de Trigo', stock: 150, unidad: 'Kg', vencimiento: '2026-12-15', alerta: false, estado: 'Activo' },
    { id: 2, nombre: 'Azúcar Refinada', stock: 5, unidad: 'Kg', vencimiento: '2027-01-20', alerta: true, estado: 'Activo' },
    { id: 3, nombre: 'Levadura', stock: 25, unidad: 'Kg', vencimiento: '2026-06-10', alerta: false, vencimientoProximo: true, estado: 'Activo' },
    { id: 4, nombre: 'Mantequilla', stock: 80, unidad: 'Kg', vencimiento: '2026-07-05', alerta: false, estado: 'Activo' },
  ]);

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setInsumos(insumos.filter(i => i.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Insumo eliminado correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Insumos</h1>
          <p className="text-muted-foreground">Gestión de inventario de insumos</p>
        </div>
        <button
          onClick={() => setShowModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
        >
          <Plus className="w-5 h-5" />
          Nuevo Insumo
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-card p-4 rounded-lg border border-warning">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <AlertTriangle className="w-5 h-5 text-warning" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Bajo</p>
              <h3>1 insumo</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-destructive">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-destructive/10 rounded-lg">
              <Clock className="w-5 h-5 text-destructive" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Por Vencer</p>
              <h3>1 insumo</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-success">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Stock Normal</p>
              <h3>2 insumos</h3>
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
              placeholder="Buscar insumo..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todas las alertas</option>
            <option>Stock bajo</option>
            <option>Por vencer</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">ID</th>
              <th className="text-left px-6 py-3">Nombre</th>
              <th className="text-left px-6 py-3">Stock</th>
              <th className="text-left px-6 py-3">Vencimiento</th>
              <th className="text-left px-6 py-3">Alertas</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {insumos.map((insumo) => (
              <tr key={insumo.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{insumo.id}</td>
                <td className="px-6 py-4">{insumo.nombre}</td>
                <td className="px-6 py-4">
                  <span className={insumo.alerta ? 'text-warning' : ''}>
                    {insumo.stock} {insumo.unidad}
                  </span>
                </td>
                <td className="px-6 py-4 text-muted-foreground">{insumo.vencimiento}</td>
                <td className="px-6 py-4">
                  <div className="flex gap-2">
                    {insumo.alerta && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-warning/10 text-warning rounded text-xs">
                        <AlertTriangle className="w-3 h-3" />
                        Stock bajo
                      </span>
                    )}
                    {insumo.vencimientoProximo && (
                      <span className="flex items-center gap-1 px-2 py-1 bg-destructive/10 text-destructive rounded text-xs">
                        <Clock className="w-3 h-3" />
                        Por vencer
                      </span>
                    )}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <span className="px-2 py-1 bg-success/10 text-success rounded text-sm">
                    {insumo.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Edit className="w-4 h-4" />
                    </button>
                    <button
                      onClick={() => setDeleteDialog({ isOpen: true, id: insumo.id, nombre: insumo.nombre })}
                      className="p-2 hover:bg-muted rounded-lg text-destructive"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-card p-6 rounded-lg w-full max-w-md">
            <h2 className="mb-4">Nuevo Insumo</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Nombre del Insumo</label>
                <input type="text" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2">Stock Inicial</label>
                  <input type="number" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                </div>
                <div>
                  <label className="block mb-2">Unidad</label>
                  <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                    <option>Kg</option>
                    <option>g</option>
                    <option>L</option>
                    <option>mL</option>
                    <option>Unidad</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block mb-2">Fecha de Vencimiento</label>
                <input type="date" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div>
                <label className="block mb-2">Stock Mínimo (Alerta)</label>
                <input type="number" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Cancelar
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  Guardar
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Insumo"
        message={`¿Estás seguro de que deseas eliminar el insumo "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        onConfirm={handleDelete}
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
