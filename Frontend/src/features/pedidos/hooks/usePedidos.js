import { useState, useEffect, useMemo } from 'react';
import { getPedidos, createPedido, updatePedido, deletePedido } from '../services/pedidosService';
import { toast } from '../../../shared/utils/toast';

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchPedidos = () => {
    setIsLoading(true);
    setLoadError(null);
    return getPedidos()
      .then((data) => setPedidos(Array.isArray(data) ? data : []))
      .catch((error) => {
        setPedidos([]);
        setLoadError(error?.message || 'No se pudieron cargar los pedidos');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchPedidos();
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
        toast.success('Cambios guardados');
      } else {
        const created = await createPedido(formData);
        setPedidos((prev) => [created, ...prev]);
        toast.success('Pedido creado');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('No se pudo guardar el pedido');
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
      toast.success('Pedido eliminado');
    } catch (error) {
      toast.error('No se pudo eliminar el pedido');
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
    isLoading,
    loadError,
    refetch: fetchPedidos,
    handleSave,
    handleDelete,
  };
}


