import FormModal from '../../../shared/components/FormModal';

export function UsuarioFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Usuario" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <div>
        <label className="block mb-2">Nombre</label>
        <input type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="block mb-2">Correo</label>
        <input type="email" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
      <div>
        <label className="block mb-2">Rol</label>
        <select className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          <option>Seleccionar rol</option>
          <option value="">Seleccionar rol</option>
          <option value="1">Administrador de Planta</option>
          <option value="2">Supervisor de Producción</option>
          <option value="3">Gestor de Compras y Proveedores</option>
          <option value="4">Vendedor y Distribución</option>
          <option value="5">Auditor de Calidad</option>
        </select>
      </div>
      <div>
        <label className="block mb-2">Contraseña</label>
        <input type="password" maxLength={255} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </div>
    </FormModal>
  );
}
