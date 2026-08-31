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
        className={`w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg focus:outline-none focus:ring-2 focus:ring-ring ${isRow ? '' : 'text-sm'}`}
      />
    </div>
  );

  if (isRow) {
    return (
      <div className="bg-card p-4 rounded-lg border border-border">
        <div className="flex gap-4">
          {searchField}
          {children}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4">
      {searchField}
      {children}
    </div>
  );
}
