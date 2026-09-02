import { useState, useEffect } from 'react';

export default function StatusSwitch({ value, onChange, activeValue = 'activo', inactiveValue = 'inactivo' }) {
  const checkIsActive = (val) => {
    const s = String(val ?? '').toLowerCase();
    return (
      s === String(activeValue).toLowerCase() ||
      s === 'completada' ||
      s === 'finalizado' ||
      s === 'true'
    );
  };

  const [enabled, setEnabled] = useState(() => checkIsActive(value));

  useEffect(() => {
    setEnabled(checkIsActive(value));
  }, [value, activeValue]);

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
