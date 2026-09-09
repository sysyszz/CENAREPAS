import { useState, useEffect, useMemo } from 'react';
import { getProveedores, createProveedor, updateProveedor, deleteProveedor } from '../services/proveedoresService';
import { toast } from '../../../shared/utils/toast';

export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
        toast.success('Cambios guardados');
      } else {
        const created = await createProveedor(formData);
        setProveedores((prev) => [created, ...prev]);
        toast.success('Proveedor registrado');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('No se pudo guardar el proveedor');
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
      toast.success('Proveedor eliminado');
    } catch (error) {
      toast.error('No se pudo eliminar el proveedor');
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
    handleSave,
    handleDelete,
  };
}


