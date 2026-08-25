import FormModal from '../../../shared/components/FormModal';
import FormField from '../../../shared/components/FormField';

export function UsuarioFormModal({ open, onClose }) {
  return (
    <FormModal open={open} title="Nuevo Usuario" onClose={onClose} onSubmit={onClose} submitLabel="Guardar" cancelLabel="Cancelar">
      <FormField label="Nombre" htmlFor="usuario-nombre" required>
        <input id="usuario-nombre" type="text" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField label="Correo" htmlFor="usuario-correo" required>
        <input id="usuario-correo" type="email" maxLength={100} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
      <FormField label="Rol" htmlFor="usuario-rol">
        <select id="usuario-rol" className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring">
          <option>Seleccionar rol</option>
          <option value="">Seleccionar rol</option>
          <option value="1">Administrador de Planta</option>
          <option value="2">Supervisor de Producción</option>
          <option value="3">Gestor de Compras y Proveedores</option>
          <option value="4">Vendedor y Distribución</option>
          <option value="5">Auditor de Calidad</option>
        </select>
      </FormField>
      <FormField label="Contraseña" htmlFor="usuario-contrasena" required>
        <input id="usuario-contrasena" type="password" maxLength={255} required className="w-full px-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring" />
      </FormField>
    </FormModal>
  );
}
