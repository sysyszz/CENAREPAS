import { useState, useEffect } from 'react';
import { getProductos, deleteProducto } from '../services/productosService';

export function useProductos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('Todas las categorías');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });
  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos().then((data) => setProductos(data));
  }, []);

  const filteredProductos = productos.filter((producto) => {
    const matchesSearch =
      producto.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      producto.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'Todas las categorías' || String(producto.id_categoria) === filterCategoria;
    const matchesEstado = filterEstado === 'Todos los estados' || producto.estado === filterEstado;

    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deleteProducto(deleteDialog.id);
    setProductos((prev) => prev.filter((p) => p.id_producto !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Producto eliminado correctamente' });
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
    toast,
    setToast,
    productos,
    filteredProductos,
    handleDelete,
  };
}

