import { useState, useEffect, useMemo } from 'react';
import { getProductos, createProducto, updateProducto, deleteProducto } from '../services/productosService';

export function useProductos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('Todas las categorías');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos().then((data) => setProductos(data));
  }, []);

  const filteredProductos = useMemo(() => {
    return productos.filter((producto) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        producto.nombre.toLowerCase().includes(q) ||
        (producto.descripcion || '').toLowerCase().includes(q);
      const matchesCategoria =
        filterCategoria === 'Todas las categorías' ||
        filterCategoria === 'Todas' ||
        String(producto.id_categoria) === filterCategoria;
      const matchesEstado =
        filterEstado === 'Todos los estados' ||
        filterEstado === 'Todos' ||
        String(producto.estado).toLowerCase() === String(filterEstado).toLowerCase();

      return matchesSearch && matchesCategoria && matchesEstado;
    });
  }, [productos, searchTerm, filterCategoria, filterEstado]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_producto) {
        const updated = await updateProducto(formData.id_producto, formData);
        setProductos((prev) =>
          prev.map((p) => (p.id_producto === formData.id_producto ? { ...p, ...updated } : p))
        );
        setToast({ isOpen: true, type: 'success', message: 'Producto actualizado correctamente' });
      } else {
        const created = await createProducto(formData);
        setProductos((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Producto creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el producto' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteProducto(deleteDialog.id);
      setProductos((prev) => prev.filter((p) => p.id_producto !== deleteDialog.id));
      setToast({ isOpen: true, type: 'success', message: 'Producto eliminado correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al eliminar el producto' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
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
  };
}


