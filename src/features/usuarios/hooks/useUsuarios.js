import { useState, useEffect } from 'react';
import { getUsuarios, deleteUsuario, updateUsuario } from '../services/usuariosService';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRol, setFilterRol] = useState('Todos los roles');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedUsuario, setSelectedUsuario] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getUsuarios().then((data) => setUsuarios(data));
  }, []);

  const filteredUsuarios = usuarios.filter((usuario) => {
    const matchesSearch =
      usuario.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      usuario.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesRol = filterRol === 'Todos los roles' || usuario.rol === filterRol;
    const matchesEstado = filterEstado === 'Todos los estados' || usuario.estado === filterEstado;
    return matchesSearch && matchesRol && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await deleteUsuario(deleteDialog.id);
    setUsuarios((prev) => prev.filter((u) => u.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Usuario eliminado correctamente' });
  };

  const handleViewDetail = (usuario) => {
    setSelectedUsuario(usuario);
    setShowDetailModal(true);
  };

  const handleEdit = (usuario) => {
    setEditData({ ...usuario });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await updateUsuario(editData.id, editData);
    setUsuarios((prev) => prev.map((u) => (u.id === editData.id ? editData : u)));
    setIsSaving(false);
    setShowEditModal(false);
    setEditData(null);
    setToast({ isOpen: true, type: 'success', message: 'Usuario actualizado correctamente' });
  };

  return {
    usuarios,
    filteredUsuarios,
    searchTerm,
    setSearchTerm,
    filterRol,
    setFilterRol,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    selectedUsuario,
    editData,
    setEditData,
    deleteDialog,
    setDeleteDialog,
    isDeleting,
    isSaving,
    toast,
    setToast,
    handleDelete,
    handleViewDetail,
    handleEdit,
    handleSaveEdit,
  };
}
