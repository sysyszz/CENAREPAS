import EditModal from '../../../shared/components/EditModal';

export function UsuarioEditModal({ open, editData, setEditData, onClose, onSave, isSaving }) {
  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text' },
    { name: 'correo', label: 'Email', type: 'email', maxLength: 100 },
    {
      name: 'id_rol',
      label: 'Rol',
      type: 'select',
      options: [
        { value: 1, label: 'Administrador de Planta' },
        { value: 2, label: 'Supervisor de Producción' },
        { value: 3, label: 'Gestor de Compras y Proveedores' },
        { value: 4, label: 'Vendedor y Distribución' },
        { value: 5, label: 'Auditor de Calidad' },
      ],
    },
    { name: 'estado', label: 'Estado', type: 'select', wide: true, options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
    ] },
  ];

  return (
    <EditModal
      open={open}
      title="Editar Usuario"
      editData={editData}
      setEditData={setEditData}
      onClose={onClose}
      onSave={onSave}
      isSaving={isSaving}
      fields={fields}
      submitLabel="Guardar"
      cancelLabel="Cancelar"
    />
  );
}
