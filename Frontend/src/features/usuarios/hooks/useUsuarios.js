import { useState, useEffect, useMemo } from 'react';
import {
  getUsuarios,
  getUsuariosEstadisticas,
  createUsuario,
  updateUsuario,
  deleteUsuario,
  cambiarEstadoUsuario,
} from '../services/usuariosService';
import { toast } from '../../../shared/utils/toast';

export const isUsuarioAdmin = (usuario, roleNames = {}) => {
  if (!usuario) return false;
  const idRol = Number(usuario.id_rol);
  const rolName = String(usuario.rol_nombre || roleNames[usuario.id_rol] || '').toLowerCase().trim();
  const correo = String(usuario.correo || '').toLowerCase().trim();
  return (
    idRol === 1 ||
    rolName === 'administrador' ||
    rolName === 'admin' ||
    correo === 'admin@sistema.com'
  );
};

export const isSameUser = (usuario, currentUser) => {
  if (!usuario || !currentUser) return false;
  if (
    usuario.id_usuario &&
    currentUser.id_usuario &&
    Number(usuario.id_usuario) === Number(currentUser.id_usuario)
  ) {
    return true;
  }
  if (
    usuario.correo &&
    currentUser.correo &&
    usuario.correo.toLowerCase().trim() === currentUser.correo.toLowerCase().trim()
  ) {
    return true;
  }
  return false;
};

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [estadisticas, setEstadisticas] = useState(null);
  const [isLoadingEstadisticas, setIsLoadingEstadisticas] = useState(true);
  const [estadisticasError, setEstadisticasError] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('Todos los roles');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [detailModal, setDetailModal] = useState({ isOpen: false, data: null });
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [statusDialog, setStatusDialog] = useState({ isOpen: false, usuario: null, nextEstado: 'Activo' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
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

  const fetchEstadisticas = () => {
    setIsLoadingEstadisticas(true);
    setEstadisticasError(null);
    return getUsuariosEstadisticas()
      .then((data) => setEstadisticas(data))
      .catch((err) => {
        setEstadisticas(null);
        setEstadisticasError(err?.message || 'No se pudieron cargar las estadísticas');
      })
      .finally(() => setIsLoadingEstadisticas(false));
  };

  useEffect(() => {
    fetchUsuarios();
    fetchEstadisticas();
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
      fetchEstadisticas();
    } catch (error) {
      toast.error(error?.data?.message || 'No se pudo guardar el usuario');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    const targetUser = usuarios.find((u) => u.id_usuario === deleteDialog.id);
    let currentUser = null;
    try {
      currentUser = JSON.parse(localStorage.getItem('user') || '{}');
    } catch {
      currentUser = null;
    }
    if (isUsuarioAdmin(targetUser) || isSameUser(targetUser, currentUser)) {
      toast.error('No se puede eliminar un usuario administrador o a ti mismo');
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
      return;
    }

    setIsDeleting(true);
    try {
      await deleteUsuario(deleteDialog.id);
      setUsuarios((prev) => prev.filter((u) => u.id_usuario !== deleteDialog.id));
      toast.success('Usuario eliminado');
      fetchEstadisticas();
    } catch (error) {
      toast.error(error?.data?.message || 'No se pudo eliminar el usuario');
    } finally {
      setIsDeleting(false);
      setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    }
  };

  const handleRequestStatusChange = (usuario) => {
    if (!usuario) return;
    const isCurrentlyActive = String(usuario.estado || '').toLowerCase() === 'activo';
    const nextEstado = isCurrentlyActive ? 'Inactivo' : 'Activo';
    setStatusDialog({
      isOpen: true,
      usuario,
      nextEstado,
    });
  };

  const handleConfirmStatusChange = async () => {
    if (!statusDialog.usuario) return;
    setIsUpdatingStatus(true);
    try {
      const { id_usuario, nombre } = statusDialog.usuario;
      const actualizado = await cambiarEstadoUsuario(id_usuario, statusDialog.nextEstado);

      setUsuarios((prev) =>
        prev.map((u) =>
          u.id_usuario === id_usuario ? { ...u, estado: actualizado?.estado || statusDialog.nextEstado } : u
        )
      );

      toast.success(`Estado del usuario "${nombre}" cambiado a ${statusDialog.nextEstado}`);
      setStatusDialog({ isOpen: false, usuario: null, nextEstado: 'Activo' });
      fetchEstadisticas();
    } catch (error) {
      toast.error(error?.data?.message || 'No se pudo actualizar el estado del usuario');
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  return {
    usuarios: filteredUsuarios,
    rawUsuarios: usuarios,
    estadisticas,
    isLoadingEstadisticas,
    estadisticasError,
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
    statusDialog,
    setStatusDialog,
    isDeleting,
    isSaving,
    isUpdatingStatus,
    isLoading,
    loadError,
    refetch: () => {
      fetchUsuarios();
      fetchEstadisticas();
    },
    refetchEstadisticas: fetchEstadisticas,
    handleSave,
    handleDelete,
    handleRequestStatusChange,
    handleConfirmStatusChange,
    isUsuarioAdmin,
    isSameUser,
  };
}
