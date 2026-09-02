import { useState, useEffect, useMemo } from 'react';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/proveedoresService';

export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getProveedores().then((data) => setProveedores(data));
  }, []);

  const filteredProveedores = useMemo(() => {
    return proveedores.filter((proveedor) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        proveedor.nombre.toLowerCase().includes(q) ||
        proveedor.nit.toLowerCase().includes(q) ||
        (proveedor.correo || '').toLowerCase().includes(q);
      const isTodosEstado = filterEstado === 'Todos los estados' || filterEstado === 'Todos';
      const matchesEstado = isTodosEstado || String(proveedor.estado).toLowerCase() === String(filterEstado).toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [proveedores, searchTerm, filterEstado]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_proveedor) {
        const updated = await updateProveedor(formData.id_proveedor, formData);
        setProveedores((prev) =>
          prev.map((p) => (p.id_proveedor === formData.id_proveedor ? { ...p, ...updated } : p))
        );
        setToast({ isOpen: true, type: 'success', message: 'Proveedor actualizado correctamente' });
      } else {
        const created = await createProveedor(formData);
        setProveedores((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Proveedor creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el proveedor' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteProveedor(deleteDialog.id);
      setProveedores((prev) => prev.filter((p) => p.id_proveedor !== deleteDialog.id));
      setToast({ isOpen: true, type: 'success', message: 'Proveedor eliminado correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al eliminar el proveedor' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
    proveedores: filteredProveedores,
    rawProveedores: proveedores,
    searchTerm,
    setSearchTerm,
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
    handleSave,
    handleDelete,
  };
}


