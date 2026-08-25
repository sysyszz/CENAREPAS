import { Search } from 'lucide-react';

export function SearchBar({
  value,
  onChange,
  onSearch,
  placeholder = 'Buscar...',
  wrapperClassName = '',
  inputClassName = '',
  iconClassName = '',
  type = 'search',
  ...props
}) {
  const handleChange = (event) => {
    onChange?.(event);
    onSearch?.(event.target.value, event);
  };

  return (
    <div className={`relative ${wrapperClassName}`.trim()}>
      <Search className={`absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground ${iconClassName}`.trim()} />
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className={`w-full pl-10 pr-4 py-2 border border-input bg-input-background rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-ring ${inputClassName}`.trim()}
        {...props}
      />
    </div>
  );
}

export default SearchBar;
