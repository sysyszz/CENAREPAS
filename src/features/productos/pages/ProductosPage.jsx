import { useState, useMemo, useEffect } from 'react';
import { Box, CheckCircle, AlertTriangle, DollarSign, Calendar } from 'lucide-react';
import { useProductos } from '../hooks/useProductos';
import { mockCategorias, getCategorias } from '../../categorias/services/categoriasService';
import { mockFichasTecnicas, getFichasTecnicas } from '../../fichas-tecnicas/services/fichasTecnicasService';
import { mockProveedores, getProveedores } from '../../proveedores/services/proveedoresService';
import { DataTable } from '../../../shared/components/DataTable';
import { RowActions } from '../../../shared/components/RowActions';
import { MetricCard } from '../../../shared/components/MetricCard';
import { ProductoFormModal } from '../components/ProductoFormModal';
import ConfirmDialog from '../../../shared/components/ConfirmDialog';
import Toast from '../../../shared/components/Toast';
import DetailModal from '../../../shared/components/DetailModal';
import PageHeader from '../../../shared/components/PageHeader';
import { usePermissions } from '../../../shared/contexts/PermissionContext';
import StatusSwitch from '../../../shared/components/StatusSwitch';

export default function ProductosPage() {
  const { can } = usePermissions();
  const {
    searchTerm,
    setSearchTerm,
    filterCategoria,
    setFilterCategoria,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    detailModal,
    setDetailModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    isSaving,
    toast,
    setToast,
    productos,
    filteredProductos,
    handleSave,
    handleDelete,
  } = useProductos();

  const [selectedProducto, setSelectedProducto] = useState(null);
  const [categorias, setCategorias] = useState(mockCategorias);
  const [fichas, setFichas] = useState(mockFichasTecnicas);
  const [proveedores, setProveedores] = useState(mockProveedores);

  useEffect(() => {
    getCategorias().then((data) => {
      if (data && data.length > 0) setCategorias(data);
    });
    getFichasTecnicas().then((data) => {
      if (data && data.length > 0) setFichas(data);
    });
    getProveedores().then((data) => {
      if (data && data.length > 0) setProveedores(data);
    });
  }, []);

  const categoryNames = useMemo(
    () => Object.fromEntries(categorias.map((cat) => [cat.id_categoria, cat.nombre])),
    [categorias]
  );

  const fichasNames = useMemo(
    () => Object.fromEntries(fichas.map((f) => [f.id_ficha, f.nombre])),
    [fichas]
  );

  const proveedoresNames = useMemo(
    () => Object.fromEntries(proveedores.map((p) => [p.id_proveedor, p.nombre])),
    [proveedores]
  );

  const totalProductos = productos.length;
  const disponibles = productos.filter(
    (p) => String(p.estado).toLowerCase() === 'disponible' || String(p.estado).toLowerCase() === 'activo'
  ).length;
  const bajoStock = productos.filter(
    (p) => String(p.estado).toLowerCase() === 'bajo stock' || Number(p.stock_actual) <= Number(p.stock_minimo)
  ).length;
  const valorInventario = productos.reduce(
    (acc, p) => acc + Number(p.precio_venta || 0) * Number(p.stock_actual || 0),
    0
  );

  const formatVencimiento = (dateStr) => {
    if (!dateStr) {
      return <span className="text-muted-foreground/50 text-xs select-none">N/A</span>;
    }

    const expDate = new Date(dateStr);
    if (isNaN(expDate.getTime())) {
      return <span className="text-muted-foreground text-xs">{dateStr}</span>;
    }

    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const target = new Date(expDate);
    target.setHours(0, 0, 0, 0);

    const diffTime = target.getTime() - today.getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const formattedDate = target.toLocaleDateString('es-CO', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });

    if (diffDays < 0) {
      return (
        <div
          className="flex items-center gap-1.5 text-destructive font-medium text-xs"
          title={`Vencido el ${formattedDate}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{formattedDate}</span>
          <span className="px-1.5 py-0.5 bg-destructive/10 rounded text-[10px] uppercase font-bold tracking-wider">
            Vencido
          </span>
        </div>
      );
    } else if (diffDays <= 7) {
      return (
        <div
          className="flex items-center gap-1.5 text-amber-600 dark:text-amber-400 font-medium text-xs"
          title={`Próximo a vencer (${diffDays} días restantes)`}
        >
          <AlertTriangle className="w-3.5 h-3.5 shrink-0" />
          <span>{formattedDate}</span>
          <span className="px-1.5 py-0.5 bg-amber-500/10 rounded text-[10px] font-semibold">
            {diffDays === 0 ? 'Vence hoy' : `Próx. ${diffDays}d`}
          </span>
        </div>
      );
    } else {
      return (
        <div className="flex items-center gap-1.5 text-muted-foreground text-xs">
          <Calendar className="w-3.5 h-3.5 text-muted-foreground/70 shrink-0" />
          <span>{formattedDate}</span>
        </div>
      );
    }
  };

  const columns = useMemo(
    () => [
      {
        key: 'id_producto',
        label: 'ID',
        render: (value) => <span className="font-mono font-medium text-xs">#{value}</span>,
      },
      {
        key: 'imagen_url',
        label: 'Imagen',
        render: (value, prod) => (
          <div className="w-12 h-12 rounded-lg bg-muted/60 border border-border overflow-hidden flex items-center justify-center shrink-0 shadow-2xs">
            {value ? (
              <img
                src={value}
                alt={prod.nombre}
                className="w-full h-full object-cover"
                onError={(e) => {
                  e.currentTarget.style.display = 'none';
                  if (e.currentTarget.nextSibling) {
                    e.currentTarget.nextSibling.style.display = 'flex';
                  }
                }}
              />
            ) : null}
            <div
              className={`w-full h-full items-center justify-center text-muted-foreground ${
                value ? 'hidden' : 'flex'
              }`}
            >
              <Box className="w-5 h-5 text-muted-foreground/40" />
            </div>
          </div>
        ),
      },
      {
        key: 'nombre',
        label: 'Producto',
        render: (value, prod) => (
          <div>
            <span className="font-semibold text-sm block text-foreground">{value}</span>
            {prod.descripcion && (
              <span className="text-xs text-muted-foreground truncate max-w-xs block" title={prod.descripcion}>
                {prod.descripcion}
              </span>
            )}
          </div>
        ),
      },
      {
        key: 'id_categoria',
        label: 'Categoría',
        render: (value) => (
          <span className="px-2.5 py-0.5 bg-primary/10 text-primary rounded-full text-xs font-medium border border-primary/20 whitespace-nowrap">
            {categoryNames[value] || (typeof value === 'string' && isNaN(Number(value)) ? value : `Categoría #${value}`)}
          </span>
        ),
      },
      {
        key: 'precio_venta',
        label: 'Precio',
        render: (value) => (
          <span className="font-medium text-sm">
            ${Number(value || 0).toLocaleString('es-CO')}
          </span>
        ),
      },
      {
        key: 'stock_actual',
        label: 'Stock',
        render: (value, prod) => {
          const isLow = Number(value) <= Number(prod.stock_minimo || 0);
          return (
            <div className="flex items-center gap-1.5">
              <span className={`font-semibold text-sm ${isLow ? 'text-amber-600 dark:text-amber-400 font-bold' : ''}`}>
                {value}
              </span>
              {isLow && (
                <span className="px-1.5 py-0.5 bg-amber-500/10 text-amber-600 dark:text-amber-400 text-[10px] rounded font-semibold">
                  Bajo
                </span>
              )}
            </div>
          );
        },
      },
      {
        key: 'fecha_vencimiento',
        label: 'Vencimiento',
        render: (value) => formatVencimiento(value),
      },
      {
        key: 'estado',
        label: 'Estado',
        render: (value) => <StatusSwitch value={value} />,
      },
      {
        key: 'acciones',
        label: 'Acciones',
        render: (_, producto) => (
          <RowActions
            onView={() => setDetailModal({ isOpen: true, data: producto })}
            onEdit={() => {
              setSelectedProducto(producto);
              setShowModal(true);
            }}
            editDisabled={!can('productos', 'editar')}
            onDelete={() =>
              setDeleteDialog({
                isOpen: true,
                id: producto.id_producto,
                nombre: producto.nombre,
              })
            }
            deleteDisabled={!can('productos', 'eliminar')}
          />
        ),
      },
    ],
    [can, categoryNames, setDetailModal, setShowModal, setDeleteDialog]
  );

  return (
    <div className="space-y-6">
      <PageHeader
        title="Productos Terminados"
        subtitle="Catálogo y stock de arepas y derivados de Masarepas"
        addLabel="Nuevo Producto"
        addDisabled={!can('productos', 'crear')}
        onAdd={() => {
          setSelectedProducto(null);
          setShowModal(true);
        }}
      />

      {/* Tarjetas de Consolidado */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        <MetricCard title="Total Productos" value={totalProductos} icon={Box} variant="primary" />
        <MetricCard title="Disponibles" value={disponibles} icon={CheckCircle} variant="success" />
        <MetricCard title="Bajo Stock" value={bajoStock} icon={AlertTriangle} variant="warning" />
        <MetricCard
          title="Valor Inventario"
          value={`$${valorInventario.toLocaleString('es-CO')}`}
          icon={DollarSign}
          variant="accent"
        />
      </div>

      {/* Tabla con DataTable */}
      <DataTable
        columns={columns}
        data={filteredProductos}
        searchPlaceholder="Buscar por código o producto..."
        searchValue={searchTerm}
        onSearchChange={setSearchTerm}
        filters={
          <>
            <select
              value={filterCategoria}
              onChange={(e) => setFilterCategoria(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todas las categorías">Todas las categorías</option>
              {categorias.map((cat) => (
                <option key={cat.id_categoria} value={String(cat.id_categoria)}>
                  {cat.nombre}
                </option>
              ))}
            </select>
            <select
              value={filterEstado}
              onChange={(e) => setFilterEstado(e.target.value)}
              className="px-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              <option value="Todos los estados">Todos los estados</option>
              <option value="activo">Activo / Disponible</option>
              <option value="inactivo">Inactivo / Bajo Stock</option>
            </select>
          </>
        }
      />

      <DetailModal
        isOpen={detailModal.isOpen}
        onClose={() => setDetailModal({ isOpen: false, data: null })}
        title="Detalle del Producto"
        fields={
          detailModal.data
            ? [
                ...(detailModal.data.imagen_url
                  ? [
                      {
                        label: 'Imagen del Producto',
                        value: (
                          <div className="w-24 h-24 rounded-lg overflow-hidden border border-border bg-muted/30 ml-auto">
                            <img
                              src={detailModal.data.imagen_url}
                              alt={detailModal.data.nombre}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        ),
                      },
                    ]
                  : []),
                { label: 'ID', value: `#${detailModal.data.id_producto}` },
                { label: 'Nombre', value: detailModal.data.nombre },
                {
                  label: 'Categoría',
                  value: categoryNames[detailModal.data.id_categoria] || detailModal.data.id_categoria,
                },
                { label: 'Descripción', value: detailModal.data.descripcion || 'N/A' },
                {
                  label: 'Precio de Venta',
                  value: `$${Number(detailModal.data.precio_venta || 0).toLocaleString('es-CO')}`,
                },
                { label: 'Stock Actual', value: detailModal.data.stock_actual },
                { label: 'Stock Mínimo', value: detailModal.data.stock_minimo },
                {
                  label: 'Fecha de Vencimiento',
                  value: detailModal.data.fecha_vencimiento || 'N/A',
                },
                {
                  label: 'Ficha Técnica / Receta',
                  value: detailModal.data.id_ficha
                    ? fichasNames[detailModal.data.id_ficha] || `Ficha #${detailModal.data.id_ficha}`
                    : 'Sin ficha asociada',
                },
                {
                  label: 'Proveedor / Fabricante',
                  value: detailModal.data.id_proveedor
                    ? proveedoresNames[detailModal.data.id_proveedor] || `Proveedor #${detailModal.data.id_proveedor}`
                    : 'Producción propia / Masarepas',
                },
                { label: 'Estado', value: detailModal.data.estado },
              ]
            : []
        }
      />

      <ProductoFormModal
        open={showModal}
        producto={selectedProducto}
        onSave={handleSave}
        isLoading={isSaving}
        onClose={() => {
          setShowModal(false);
          setSelectedProducto(null);
        }}
      />

      <ConfirmDialog
        isOpen={deleteDialog.isOpen}
        title="Eliminar Producto"
        message={`¿Estás seguro de que deseas eliminar el producto "${deleteDialog.nombre}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar"
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
