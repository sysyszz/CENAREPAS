export default function FormField({ label, htmlFor, required = false, error, children, className = '' }) {
  return (
    <div className={className}>
      <label htmlFor={htmlFor} className="block mb-2 text-sm font-medium">
        {label}{required && ' *'}
      </label>
      {children}
      {error && <p className="mt-1 text-sm text-destructive">{error}</p>}
    </div>
  );
}
