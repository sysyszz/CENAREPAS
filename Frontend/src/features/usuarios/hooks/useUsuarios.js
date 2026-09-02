import { useState, useEffect, useMemo } from 'react';
import { getUsuarios, createUsuario, updateUsuario, deleteUsuario } from '../services/usuariosService';

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
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getUsuarios().then((data) => setUsuarios(data));
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
        setToast({ isOpen: true, type: 'success', message: 'Usuario actualizado correctamente' });
      } else {
        const created = await createUsuario(formData);
        setUsuarios((prev) => [created, ...prev]);
        setToast({ isOpen: true, type: 'success', message: 'Usuario creado correctamente' });
      }
      setShowModal(false);
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al guardar el usuario' });
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
      setToast({ isOpen: true, type: 'success', message: 'Usuario eliminado correctamente' });
    } catch (error) {
      setToast({ isOpen: true, type: 'error', message: 'Error al eliminar el usuario' });
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
    toast,
    setToast,
    handleSave,
    handleDelete,
  };
}

