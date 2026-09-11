import { useState, useEffect } from 'react';
import { getCategorias, createCategoria, updateCategoria, deleteCategoria } from '../services/categoriasService';
import { toast } from '../../../shared/utils/toast';

export function useCategorias() {
  const [categorias, setCategorias] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    getCategorias()
      .then((data) => setCategorias(Array.isArray(data) ? data : []))
      .catch(() => setCategorias([]));
  }, []);

  const filteredCategorias = categorias.filter((c) => {
    const matchesSearch =
      c.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (c.descripcion || '').toLowerCase().includes(searchQuery.toLowerCase());
    const matchesEstado = estadoFilter === 'Todos' || c.estado === estadoFilter;
    return matchesSearch && matchesEstado;
  });

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_categoria) {
        const updated = await updateCategoria(formData.id_categoria, formData);
        setCategorias((prev) =>
          prev.map((c) => (c.id_categoria === formData.id_categoria ? { ...c, ...updated } : c))
        );
        toast.success('Cambios guardados');
      } else {
        const created = await createCategoria(formData);
        setCategorias((prev) => [created, ...prev]);
        toast.success('Categoría creada');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('No se pudo guardar la categoría');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteCategoria(deleteDialog.id);
      setCategorias((prev) => prev.filter((c) => c.id_categoria !== deleteDialog.id));
      toast.success('Categoría eliminada');
    } catch (error) {
      toast.error('No se pudo eliminar la categoría');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
    categorias: filteredCategorias,
    rawCategorias: categorias,
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
    handleSave,
    handleDelete,
  };
}

