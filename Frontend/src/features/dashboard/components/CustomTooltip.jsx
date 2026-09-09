const formatValue = (value) =>
  typeof value === 'number' ? value.toLocaleString('es-CO') : value;

export function CustomTooltip({ active, payload, label, valuePrefix = '', formatter }) {
  if (!active || !payload || !payload.length) return null;

  return (
    <div className="min-w-[140px] rounded-xl border border-[#e8dcc0] bg-[#fffbf0] px-3.5 py-2.5 shadow-[0_14px_28px_-6px_rgba(61,42,23,0.32)]">
      {label != null && (
        <p className="mb-1.5 text-[0.68rem] font-semibold uppercase tracking-[0.06em] text-[#78633f]">
          {label}
        </p>
      )}
      <div className="space-y-1">
        {payload.map((entry, index) => (
          <div key={`${entry.dataKey ?? index}`} className="flex items-center justify-between gap-4 text-xs">
            <span className="flex items-center gap-1.5 font-medium text-[#6b5636]">
              <span
                className="h-2 w-2 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color || entry.fill }}
              />
              {entry.name}
            </span>
            <span className="font-mono font-semibold text-[#2a1206]">
              {formatter ? formatter(entry.value) : `${valuePrefix}${formatValue(entry.value)}`}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
