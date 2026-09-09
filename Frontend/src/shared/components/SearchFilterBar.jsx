import { Search } from 'lucide-react';

export function SearchFilterBar({
  value,
  onChange,
  placeholder = 'Buscar...',
  children,
  layout = 'responsive',
}) {
  const isRow = layout === 'row';
  const searchField = (
    <div className="flex-1 relative">
      <Search
        className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${isRow ? 'w-5 h-5' : 'w-4 h-4'}`}
      />
      <input
        type="search"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        className={`w-full pl-10 pr-4 h-10 border border-input bg-input-background rounded-lg text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#C1502D]/15 dark:focus:ring-[#E8B23D]/20 focus:border-[#C1502D] dark:focus:border-[#E8B23D] transition-all shadow-xs`}
      />
    </div>
  );

  if (isRow) {
    return (
      <div className="bg-card p-4 rounded-xl border border-border shadow-xs">
        <div className="flex gap-4">
          {searchField}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-xl border border-border shadow-xs flex flex-col sm:flex-row gap-4">
      {searchField}
      {children}
    </div>
  );
}
