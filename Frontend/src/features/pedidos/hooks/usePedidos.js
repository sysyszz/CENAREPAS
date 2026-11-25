import { useState, useEffect, useMemo } from 'react';
import {
  getPedidos,
  getResumenPedidos,
  createPedido,
  updatePedido,
  updatePedidoEstado,
  deletePedido,
  getEstadosDestino,
} from '../services/pedidosService';
import { toast } from '../../../shared/utils/toast';

export function usePedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [resumen, setResumen] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, pedido: null, nextEstado: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [isLoadingResumen, setIsLoadingResumen] = useState(true);
  const [resumenError, setResumenError] = useState(null);

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

  const fetchResumen = async () => {
    setIsLoadingResumen(true);
    setResumenError(null);
    try {
      const data = await getResumenPedidos();
      setResumen(data);
    } catch (error) {
      setResumen(null);
      setResumenError(error?.message || 'No se pudo cargar el resumen de pedidos');
    } finally {
      setIsLoadingResumen(false);
    }
  };

  useEffect(() => {
    fetchPedidos();
    fetchResumen();
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
      await fetchResumen();
      setShowModal(false);
    } catch (error) {
      toast.error(error?.message || 'No se pudo guardar el pedido');
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
      await fetchResumen();
      toast.success('Pedido anulado');
    } catch (error) {
      toast.error(error?.message || 'No se pudo anular el pedido');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  const handleRequestStatusChange = (pedido, nextEstado) => {
    if (!pedido || !getEstadosDestino(pedido.estado).includes(nextEstado)) {
      toast.error(`Un pedido ${pedido?.estado || ''} no puede pasar a ${nextEstado || 'ese estado'}`.trim());
      return;
    }
    setStatusDialog({
      isOpen: true,
      pedido,
      nextEstado,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusDialog.pedido || !statusDialog.nextEstado) return;
    setIsUpdatingStatus(true);
    try {
      const { id_pedido } = statusDialog.pedido;
      const updated = await updatePedidoEstado(id_pedido, statusDialog.nextEstado);

      setPedidos((prev) =>
        prev.map((p) =>
          p.id_pedido === id_pedido ? { ...p, ...updated } : p
        )
      );

      await fetchResumen();
      toast.success(`Estado del pedido #${id_pedido} cambiado a ${statusDialog.nextEstado}`);
      setStatusDialog({ isOpen: false, pedido: null, nextEstado: '' });
    } catch (error) {
      toast.error(error?.message || 'No se pudo actualizar el estado del pedido');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    pedidos: filteredPedidos,
    rawPedidos: pedidos,
    resumen,
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
    statusDialog,
    setStatusDialog,
    isDeleting,
    isSaving,
    isUpdatingStatus,
    isLoading,
    loadError,
    isLoadingResumen,
    resumenError,
    refetch: fetchPedidos,
    refetchResumen: fetchResumen,
    handleSave,
    handleDelete,
    handleRequestStatusChange,
    handleConfirmStatusChange,
  };
}
