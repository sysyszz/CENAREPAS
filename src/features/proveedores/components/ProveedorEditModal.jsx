import EditModal from '../../../shared/components/EditModal';

export function ProveedorEditModal({ open, editData, setEditData, onClose, onSave, isSaving }) {
  const fields = [
    { name: 'nombre', label: 'Nombre', type: 'text' },
    { name: 'nit', label: 'NIT', type: 'text' },
    { name: 'telefono', label: 'Teléfono', type: 'tel' },
    { name: 'correo', label: 'Correo', type: 'email' },
    { name: 'direccion', label: 'Dirección', type: 'text' },
    { name: 'estado', label: 'Estado', type: 'select', wide: true, options: [
      { value: 'activo', label: 'Activo' },
      { value: 'inactivo', label: 'Inactivo' },
    ] },
  ];

  return (
    <EditModal
      open={open}
      title="Editar Proveedor"
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
