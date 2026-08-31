import { useState, useEffect, useMemo } from 'react';
import { getVentas, createVenta, updateVenta, deleteVenta } from '../services/ventasService';

export function useVentas() {
  const [ventas, setVentas] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getVentas().then((data) => setVentas(data));
  }, []);

  const filteredVentas = useMemo(() => {
    return ventas.filter((v) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        String(v.id_venta).toLowerCase().includes(q) ||
        String(v.id_cliente).toLowerCase().includes(q) ||
        String(v.id_sede).toLowerCase().includes(q) ||
        (v.medio_pago || '').toLowerCase().includes(q);
      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodosEstado || String(v.estado).toLowerCase() === String(estadoFilter).toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [ventas, searchQuery, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_venta) {
        const updated = await updateVenta(formData.id_venta, formData);
        setVentas((prev) =>
          prev.map((v) => (v.id_venta === formData.id_venta ? { ...v, ...updated } : v))
        );
        setToast({ isOpen: true, type: 'success', message: 'Venta actualizada correctamente' });
      } else {
        const created = await createVenta(formData);
        setVentas((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Venta registrada correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar la venta' });
    } finally {
      setIsSaving(false);
    }
  };

  const handleAnular = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await updateVenta(deleteDialog.id, { estado: 'anulada' });
      setVentas((prev) =>
        prev.map((v) => (v.id_venta === deleteDialog.id ? { ...v, estado: 'anulada' } : v))
      );
      setToast({ isOpen: true, type: 'success', message: 'Venta anulada correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al anular la venta' });
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
    ventas: filteredVentas,
    rawVentas: ventas,
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
    handleAnular,
  };
}

