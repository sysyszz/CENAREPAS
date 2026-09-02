import { useState } from 'react';

export default function StatusSwitch({ value, onChange, activeValue = 'activo', inactiveValue = 'inactivo' }) {
  const [enabled, setEnabled] = useState(value === activeValue || value === 'completada' || value === 'finalizado');

  const handleToggle = () => {
    const nextEnabled = !enabled;
    setEnabled(nextEnabled);
    onChange?.(nextEnabled ? activeValue : inactiveValue);
  };

  return (
    <button
      type="button"
      role="switch"
      aria-checked={enabled}
      aria-label={enabled ? 'Desactivar registro' : 'Activar registro'}
      onClick={handleToggle}
      className={`status-switch ${enabled ? 'status-switch-on' : 'status-switch-off'}`}
    >
      <span className="status-switch-thumb" />
      <span className="status-switch-label">{enabled ? 'Activo' : 'Inactivo'}</span>
    </button>
  );
}
