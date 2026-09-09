import React from 'react';
import { Plus, Inbox } from 'lucide-react';

export function EmptyState({
  icon: Icon = Inbox,
  title,
  description,
  isFiltered = false,
  entityName = 'registros',
  onAdd,
  addLabel = 'Nuevo Registro',
  addDisabled = false,
}) {
  const displayTitle = title || (isFiltered ? 'No se encontraron resultados' : `No hay ${entityName} registrados`);
  const displayDescription = description || (
    isFiltered
      ? 'Intenta con otro término de búsqueda o ajusta los filtros seleccionados.'
      : `Comienza agregando el primer registro de ${entityName} en el sistema.`
  );

  return (
    <div className="flex flex-col items-center justify-center py-12 px-4 text-center">
      {/* Contenedor del Ícono con paleta de marca CENAREPAS */}
      <div className="size-16 rounded-2xl bg-[#FFE1D0]/60 dark:bg-[#C1502D]/15 border border-[#E8DCC0] dark:border-[rgba(148,163,184,0.14)] flex items-center justify-center mb-3.5 shadow-xs">
        <Icon className="size-8 text-[#C1502D] dark:text-[#E8B23D] opacity-80" strokeWidth={1.75} />
      </div>

      {/* Título Principal */}
      <h3 className="text-base font-bold text-foreground tracking-tight m-0">
        {displayTitle}
      </h3>

      {/* Descripción Secundaria */}
      <p className="text-xs sm:text-sm text-muted-foreground max-w-md mx-auto mt-1.5 mb-0 leading-relaxed font-normal">
        {displayDescription}
      </p>

      {/* Botón de Creación (solo cuando la lista está completamente vacía, no en búsqueda) */}
      {!isFiltered && onAdd && (
        <button
          type="button"
          onClick={onAdd}
          disabled={addDisabled}
          className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors disabled:opacity-50 cursor-pointer shadow-xs mt-4.5"
        >
          <Plus className="w-4 h-4" />
          <span>{addLabel}</span>
        </button>
      )}
    </div>
  );
}

export default EmptyState;
