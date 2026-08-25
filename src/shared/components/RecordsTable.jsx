export default function RecordsTable({
  columns,
  data = [],
  rowKey,
  renderRow,
  emptyMessage = 'No se encontraron resultados.',
  tableClassName = 'w-full text-sm text-left',
  headerClassName = 'bg-muted text-muted-foreground font-semibold',
  bodyClassName = 'divide-y divide-border',
}) {
  return (
    <div className="records-table-shell bg-card rounded-lg border border-border overflow-hidden">
      <table className={tableClassName}>
        <thead className={headerClassName}>
          <tr>
            {columns.map((column) => (
              <th key={column.key} className={column.headerClassName || 'px-6 py-3'}>
                {column.label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className={bodyClassName}>
          {data.length > 0 ? (
            data.map((record, index) => (
              <tr key={rowKey ? rowKey(record) : index} className="hover:bg-muted/50 transition-colors">
                {renderRow(record)}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length} className="px-6 py-8 text-center text-muted-foreground">
                {emptyMessage}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}
