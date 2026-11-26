import React from 'react';
import { cn } from './cn';

/**
 * Formatea una fecha ISO/UTC a la zona horaria America/Bogota.
 * Devuelve un objeto { fecha, hora } donde:
 *  - fecha: ej. "13/11/2026"
 *  - hora: ej. "14:35"
 */
export function formatBogotaDateTime(dateString) {
  if (!dateString) return { fecha: '—', hora: '' };

  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return { fecha: String(dateString), hora: '' };
  }

  try {
    const formatter = new Intl.DateTimeFormat('en-GB', {
      timeZone: 'America/Bogota',
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hourCycle: 'h23',
    });

    const parts = formatter.formatToParts(date);
    const value = (type) => parts.find((part) => part.type === type)?.value || '';
    const fecha = `${value('day')}/${value('month')}/${value('year')}`;
    const hora = `${value('hour')}:${value('minute')}`;

    return { fecha, hora };
  } catch (error) {
    console.error('Error al formatear fecha Bogota:', error);
    return { fecha: String(dateString), hora: '' };
  }
}

/**
 * Devuelve la fecha y hora en una sola línea de texto, ideal para PDFs, Excel o atributos title.
 * Ejemplo: "13/11/2026 14:35"
 */
export function formatBogotaDateTimeText(dateString) {
  const { fecha, hora } = formatBogotaDateTime(dateString);
  if (!fecha || fecha === '—') return '—';
  return hora ? `${fecha} ${hora}` : fecha;
}

/**
 * Componente visual para columnas de fecha en tablas.
 * Muestra la fecha y la hora formateadas en una sola línea.
 * Convierte a America/Bogota y no corta el texto.
 */
export function DateCell({ date, className }) {
  const { fecha, hora } = formatBogotaDateTime(date);

  if (!fecha || fecha === '—') {
    return <span className="text-muted-foreground">—</span>;
  }

  return (
    <div className={cn('flex flex-col text-left whitespace-nowrap leading-tight', className)}>
      <span className="font-medium text-foreground text-xs sm:text-sm">
        {fecha}
        {hora && <> <span className="text-[11px] text-muted-foreground mt-0.5">{hora}</span></>}
      </span>
    </div>
  );
}

export default DateCell;
