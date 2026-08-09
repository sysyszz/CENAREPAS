import { useState, useEffect } from 'react';
import { getProveedores, deleteProveedor, updateProveedor } from '../services/proveedoresService';

export function useProveedores() {
  const [proveedores, setProveedores] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterEstado, setFilterEstado] = useState('Todos los estados');
  const [showModal, setShowModal] = useState(false);
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedProveedor, setSelectedProveedor] = useState(null);
  const [editData, setEditData] = useState(null);
  const [deleteDialog, setDeleteDialog] = useState({ isOpen: false, id: null, nombre: '' });
  const [isDeleting, setIsDeleting] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  useEffect(() => {
    getProveedores().then((data) => setProveedores(data));
  }, []);

  const filteredProveedores = proveedores.filter((proveedor) => {
    const matchesSearch =
      proveedor.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.contacto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      proveedor.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesEstado = filterEstado === 'Todos los estados' || proveedor.estado === filterEstado;
    return matchesSearch && matchesEstado;
  });

  const handleDelete = async () => {
    if (!deleteDialog.id) return;
    setIsDeleting(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await deleteProveedor(deleteDialog.id);
    setProveedores((prev) => prev.filter((p) => p.id !== deleteDialog.id));
    setIsDeleting(false);
    setDeleteDialog({ isOpen: false, id: null, nombre: '' });
    setToast({ isOpen: true, type: 'success', message: 'Proveedor eliminado correctamente' });
  };

  const handleViewDetail = (proveedor) => {
    setSelectedProveedor(proveedor);
    setShowDetailModal(true);
  };

  const handleEdit = (proveedor) => {
    setEditData({ ...proveedor });
    setShowEditModal(true);
  };

  const handleSaveEdit = async () => {
    if (!editData) return;
    setIsSaving(true);
    await new Promise((resolve) => setTimeout(resolve, 1000));
    await updateProveedor(editData.id, editData);
    setProveedores((prev) => prev.map((p) => (p.id === editData.id ? editData : p)));
    setIsSaving(false);
    setShowEditModal(false);
    setEditData(null);
    setToast({ isOpen: true, type: 'success', message: 'Proveedor actualizado correctamente' });
  };

  return {
    proveedores,
    filteredProveedores,
    searchTerm,
    setSearchTerm,
    filterEstado,
    setFilterEstado,
    showModal,
    setShowModal,
    showDetailModal,
    setShowDetailModal,
    showEditModal,
    setShowEditModal,
    selectedProveedor,
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
