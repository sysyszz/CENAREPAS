import { useState } from 'react';
import { Plus, Search, Eye, XCircle, FileDown, FileSpreadsheet } from 'lucide-react';
import ConfirmDialog from './ConfirmDialog';
import Toast from './Toast';

export default function Ventas() {
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState<{ isOpen: boolean; id: number | null; nombre: string }>({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState<{ isOpen: boolean; type: 'success' | 'error'; message: string }>({ isOpen: false, type: 'success', message: '' });

  const [ventas, setVentas] = useState([
    { id: 1, codigo: 'VEN-001', cliente: 'Juan Pérez', fecha: '2026-06-02', hora: '10:30', total: '$45.00', estado: 'Completada' },
    { id: 2, codigo: 'VEN-002', cliente: 'María García', fecha: '2026-06-02', hora: '11:15', total: '$32.00', estado: 'Completada' },
    { id: 3, codigo: 'VEN-003', cliente: 'Carlos López', fecha: '2026-06-01', hora: '14:20', total: '$89.00', estado: 'Completada' },
    { id: 4, codigo: 'VEN-004', cliente: 'Ana Martínez', fecha: '2026-06-01', hora: '16:45', total: '$25.00', estado: 'Anulada' },
  ]);

  const handleAnular = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setVentas(ventas.map(v => v.id === deleteDialog.id ? { ...v, estado: 'Anulada' } : v));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Venta anulada correctamente' });
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1>Ventas</h1>
          <p className="text-muted-foreground">Registro de ventas realizadas</p>
        </div>
        <div className="flex gap-2">
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <FileDown className="w-5 h-5" />
            Exportar PDF
          </button>
          <button className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted">
            <FileSpreadsheet className="w-5 h-5" />
            Exportar Excel
          </button>
          <button
            onClick={() => setShowModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90"
          >
            <Plus className="w-5 h-5" />
            Nueva Venta
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-success/10 rounded-lg">
              <svg className="w-5 h-5 text-success" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Ventas Hoy</p>
              <h3>$77.00</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-primary/10 rounded-lg">
              <svg className="w-5 h-5 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total Ventas</p>
              <h3>2 ventas</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-accent/10 rounded-lg">
              <svg className="w-5 h-5 text-accent" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Promedio</p>
              <h3>$38.50</h3>
            </div>
          </div>
        </div>
        <div className="bg-card p-4 rounded-lg border border-border">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-warning/10 rounded-lg">
              <svg className="w-5 h-5 text-warning" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
              </svg>
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Productos Vendidos</p>
              <h3>45 unidades</h3>
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
              placeholder="Buscar venta..."
              className="w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
            />
          </div>
          <input
            type="date"
            className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring"
          />
          <select className="px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
            <option>Todos los estados</option>
            <option>Completada</option>
            <option>Anulada</option>
          </select>
        </div>
      </div>

      <div className="bg-card rounded-lg border border-border overflow-hidden">
        <table className="w-full">
          <thead className="bg-muted">
            <tr>
              <th className="text-left px-6 py-3">Código</th>
              <th className="text-left px-6 py-3">Cliente</th>
              <th className="text-left px-6 py-3">Fecha</th>
              <th className="text-left px-6 py-3">Hora</th>
              <th className="text-left px-6 py-3">Total</th>
              <th className="text-left px-6 py-3">Estado</th>
              <th className="text-left px-6 py-3">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {ventas.map((venta) => (
              <tr key={venta.id} className="border-b border-border hover:bg-muted/50">
                <td className="px-6 py-4">{venta.codigo}</td>
                <td className="px-6 py-4">{venta.cliente}</td>
                <td className="px-6 py-4 text-muted-foreground">{venta.fecha}</td>
                <td className="px-6 py-4 text-muted-foreground">{venta.hora}</td>
                <td className="px-6 py-4">{venta.total}</td>
                <td className="px-6 py-4">
                  <span className={`px-2 py-1 rounded text-sm ${
                    venta.estado === 'Completada'
                      ? 'bg-success/10 text-success'
                      : 'bg-destructive/10 text-destructive'
                  }`}>
                    {venta.estado}
                  </span>
                </td>
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <button className="p-2 hover:bg-muted rounded-lg">
                      <Eye className="w-4 h-4" />
                    </button>
                    {venta.estado !== 'Anulada' && (
                      <button
                        onClick={() => setDeleteDialog({ isOpen: true, id: venta.id, nombre: venta.codigo })}
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
          <div className="bg-card p-6 rounded-lg w-full max-w-3xl max-h-[90vh] overflow-y-auto">
            <h2 className="mb-4">Nueva Venta</h2>
            <div className="space-y-4">
              <div>
                <label className="block mb-2">Cliente (Opcional)</label>
                <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                  <option>Cliente Genérico</option>
                  <option>Juan Pérez</option>
                  <option>María García</option>
                  <option>Carlos López</option>
                </select>
              </div>
              <div>
                <label className="block mb-4">Productos</label>
                <div className="space-y-2 mb-4">
                  <div className="flex gap-2">
                    <select className="flex-1 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
                      <option>Seleccionar producto</option>
                      <option>Pan Francés - $2.50</option>
                      <option>Torta de Chocolate - $25.00</option>
                      <option>Croissant - $3.50</option>
                    </select>
                    <input type="number" placeholder="Cantidad" className="w-32 px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
                    <button className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
                <div className="p-4 bg-muted rounded-lg">
                  <div className="flex justify-between items-center">
                    <span>Total:</span>
                    <span className="text-2xl text-primary">$0.00</span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 pt-4">
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 border border-border rounded-lg hover:bg-muted">
                  Cancelar
                </button>
                <button onClick={() => setShowModal(false)} className="flex-1 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90">
                  Registrar Venta
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Anular Venta"
        message={`¿Estás seguro de que deseas anular la venta "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
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
