import { Plus, FileDown, FileSpreadsheet } from 'lucide-react';

export default function PageHeader({
  title,
  subtitle,
  onAdd,
  addLabel = 'Nuevo',
  addDisabled = false,
  onExportPdf,
  onExportExcel,
  extraActions,
}) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold">{title}</h1>
        {subtitle && <p className="text-muted-foreground">{subtitle}</p>}
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onExportPdf}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
        >
          <FileDown className="w-4 h-4" />
          Exportar PDF
        </button>
        <button
          onClick={onExportExcel}
          className="flex items-center gap-2 px-4 py-2 border border-border rounded-lg hover:bg-muted text-sm font-medium transition-colors"
        >
          <FileSpreadsheet className="w-4 h-4" />
          Exportar Excel
        </button>
        {extraActions}
        {onAdd && (
          <button
            onClick={onAdd}
            disabled={addDisabled}
            className="flex items-center gap-2 px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:opacity-90 text-sm font-medium transition-colors disabled:opacity-50"
          >
            <Plus className="w-4 h-4" />
            {addLabel}
          </button>
        )}
      </div>
    </div>
  );
}
