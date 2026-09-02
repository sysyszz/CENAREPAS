import { useState, useEffect, useMemo } from 'react';
import { getPedidos, createPedido, updatePedido, deletePedido } from '../services/pedidosService';

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getPedidos().then((data) => setPedidos(data));
  }, []);

  const filteredPedidos = useMemo(() => {
    return pedidos.filter((p) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(p.id_pedido).toLowerCase().includes(q) ||
        String(p.id_cliente).toLowerCase().includes(q) ||
        (p.observaciones || '').toLowerCase().includes(q);
      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodosEstado || String(p.estado).toLowerCase() === String(estadoFilter).toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [pedidos, searchQuery, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_pedido) {
        const updated = await updatePedido(formData.id_pedido, formData);
        setPedidos((prev) =>
          prev.map((p) => (p.id_pedido === formData.id_pedido ? { ...p, ...updated } : p))
        );
        setToast({ isOpen: true, type: 'success', message: 'Pedido actualizado correctamente' });
      } else {
        const created = await createPedido(formData);
        setPedidos((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Pedido creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el pedido' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deletePedido(deleteDialog.id);
      setPedidos((prev) => prev.filter((p) => p.id_pedido !== deleteDialog.id));
      setToast({ isOpen: true, type: 'success', message: 'Pedido eliminado correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al eliminar el pedido' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
    pedidos: filteredPedidos,
    rawPedidos: pedidos,
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


