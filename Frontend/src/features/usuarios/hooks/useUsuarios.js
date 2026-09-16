import { useState, useEffect, useMemo } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuariosService';
import { toast } from '../../../shared/utils/toast';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('Todos los roles');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);

  const fetchUsuarios = () => {
    setIsLoading(true);
    setLoadError(null);
    return getUsuarios()
      .then((data) => setUsuarios(Array.isArray(data) ? data : []))
      .catch((error) => {
        setUsuarios([]);
        setLoadError(error?.message || 'No se pudieron cargar los usuarios');
      })
      .finally(() => setIsLoading(false));
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const filteredUsuarios = useMemo(() => {
    return usuarios.filter((usuario) => {
      const q = searchTerm.toLowerCase().trim();
      const matchesSearch =
        !q ||
        usuario.nombre.toLowerCase().includes(q) ||
        usuario.correo.toLowerCase().includes(q);
      const isTodosRol = filterRol === 'Todos los roles' || filterRol === 'Todos';
      const matchesRol = isTodosRol || String(usuario.id_rol) === filterRol;
      const isTodosEstado = filterEstado === 'Todos los estados' || filterEstado === 'Todos';
      const matchesEstado = isTodosEstado || String(usuario.estado).toLowerCase() === String(filterEstado).toLowerCase();
      return matchesSearch && matchesRol && matchesEstado;
    });
  }, [usuarios, searchTerm, filterRol, filterEstado]);

  const handleSave = async (formData) => {
    setIsSaving(true);
    try {
      if (formData.id_usuario) {
        const updated = await updateUsuario(formData.id_usuario, formData);
        setUsuarios((prev) =>
          prev.map((u) => (u.id_usuario === formData.id_usuario ? { ...u, ...updated } : u))
        );
        toast.success('Cambios guardados');
      } else {
        const created = await createUsuario(formData);
        setUsuarios((prev) => [created, ...prev]);
        toast.success('Usuario creado');
      }
      setShowModal(false);
    } catch (error) {
      toast.error('No se pudo guardar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    try {
      await deleteUsuario(deleteDialog.id);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== deleteDialog.id));
      toast.success('Usuario eliminado');
    } catch (error) {
      toast.error('No se pudo eliminar el usuario');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  return {
    usuarios: filteredUsuarios,
    rawUsuarios: usuarios,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
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
    isLoading,
    loadError,
    refetch: fetchUsuarios,
    handleSave,
    handleDelete,
  };
}

