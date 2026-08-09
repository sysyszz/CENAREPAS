import { useState, useEffect } from 'react';
import { getProductos } from '../services/productosService';

export function useProductos() {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategoria, setFilterCategoria] = useState('Todas las categorías');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  const [productos, setProductos] = useState([]);

  useEffect(() => {
    getProductos().then((data) => setProductos(data));
  }, []);

  // Filtrar productos
  const filteredProductos = productos.filter(producto => {
    const matchesSearch = producto.nombre.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategoria = filterCategoria === 'Todas las categorías' || producto.categoria === filterCategoria;
    const matchesEstado = filterEstado === 'Todos los estados' || producto.estado === filterEstado;

    return matchesSearch && matchesCategoria && matchesEstado;
  });

  const handleDelete = async () => {
    setIsDeleting(true);
    await new Promise(resolve => setTimeout(resolve, 1000));

    setProductos(productos.filter(p => p.id !== deleteDialog.id));
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
