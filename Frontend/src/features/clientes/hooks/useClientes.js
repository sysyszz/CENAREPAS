import { useState, useEffect, useMemo } from 'react';
import { getClientes, createCliente, updateCliente, deleteCliente } from '../services/clientesService';

export function useClientes() {
  const [clientes, setClientes] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getClientes().then((data) => setClientes(data));
  }, []);

  const filteredClientes = useMemo(() => {
    return clientes.filter((c) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        c.nombre.toLowerCase().includes(q) ||
        (c.documento || '').toLowerCase().includes(q) ||
        (c.correo || '').toLowerCase().includes(q) ||
        (c.direccion || '').toLowerCase().includes(q) ||
        (c.telefono || '').toLowerCase().includes(q);

      const isTodos = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado =
        isTodos || String(c.estado).toLowerCase() === String(estadoFilter).toLowerCase();

      return matchesSearch && matchesEstado;
    });
  }, [clientes, searchQuery, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_cliente) {
        const updated = await updateCliente(formData.id_cliente, formData);
        setClientes((prev) =>
          prev.map((c) => (c.id_cliente === formData.id_cliente ? { ...c, ...updated } : c))
        );
        setToast({ isOpen: true, type: 'success', message: 'Cliente actualizado correctamente' });
      } else {
        const created = await createCliente(formData);
        setClientes((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Cliente creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el cliente' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 500));
    await deleteCliente(deleteDialog.id);
    setClientes((prev) => prev.filter((c) => c.id_cliente !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Cliente eliminado correctamente' });
  };

  return {
    clientes: filteredClientes,
    rawClientes: clientes,
    searchQuery,
    setSearchQuery,
    estadoFilter,
    setEstadoFilter,
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
