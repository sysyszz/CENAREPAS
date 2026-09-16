import { useState, useEffect, useMemo } from 'react';
import { getRoles, createRol, updateRol, deleteRol } from '../services/rolesService';
import { toast } from '../../../shared/utils/toast';

export function useRoles() {
  const [roles, setRoles] = useState([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [estadoFilter, setEstadoFilter] = useState('Todos');
  const [showModal, setShowModal] = useState(false);
  const [selectedRole, setSelectedRole] = useState(null);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchRoles = () => {
    setIsLoading(true);
    setLoadError(null);
    return getRoles()
      .then((data) => setRoles(Array.isArray(data) ? data : []))
      .catch((error) => {
        setRoles([]);
        setLoadError(error?.message || 'No se pudieron cargar los roles');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchRoles();
  }, []);

  const filteredRoles = useMemo(() => {
    return roles.filter((r) => {
      const q = searchQuery.toLowerCase().trim();
      const matchesSearch =
        !q ||
        r.nombre.toLowerCase().includes(q) ||
        (r.descripcion || '').toLowerCase().includes(q);
      const isTodosEstado = estadoFilter === 'Todos' || estadoFilter === 'Todos los estados';
      const matchesEstado = isTodosEstado || String(r.estado).toLowerCase() === String(estadoFilter).toLowerCase();
      return matchesSearch && matchesEstado;
    });
  }, [roles, searchQuery, estadoFilter]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_rol) {
        const updated = await updateRol(formData.id_rol, formData);
        setRoles((prev) =>
          prev.map((r) => (r.id_rol === formData.id_rol ? { ...r, ...updated } : r))
        );
        toast.success('Cambios guardados');
      } else {
        const created = await createRol(formData);
        setRoles((prev) => [created, ...prev]);
        toast.success('Rol creado');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('No se pudo guardar el rol');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteRol(deleteDialog.id);
      setRoles((prev) => prev.filter((r) => r.id_rol !== deleteDialog.id));
      toast.success('Rol eliminado');
    } catch (error) {
      toast.error('No se pudo eliminar el rol');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
    roles: filteredRoles,
    rawRoles: roles,
    searchQuery,
    setSearchQuery,
    estadoFilter,
    setEstadoFilter,
    showModal,
    setShowModal,
    selectedRole,
    setSelectedRole,
    detailModal,
    setDetailModal,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    isSaving,
    isLoading,
    loadError,
    refetch: fetchRoles,
    handleSave,
    handleDelete,
  };
}


