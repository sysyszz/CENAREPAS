import { Search } from 'lucide-react';

export default function RecordsFilterToolbar({
  searchQuery,
  onSearchChange,
  searchPlaceholder,
  children,
  className = '',
  searchIconClassName = 'w-4 h-4',
  searchInputClassName = 'text-sm',
}) {
  return (
    <div className={`bg-card p-4 rounded-lg border border-border flex flex-col sm:flex-row gap-4 ${className}`}>
      <div className="flex-1 relative">
        <Search className={`absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground ${searchIconClassName}`} />
        <input
          type="search"
          placeholder={searchPlaceholder}
          value={searchQuery}
          onChange={(event) => onSearchChange(event.target.value)}
          className={`w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg ${searchInputClassName} focus:outline-none focus:ring-2 focus:ring-ring`}
        />
      </div>
      {children}
    </div>
  );
}