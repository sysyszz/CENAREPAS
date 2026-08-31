export default function DetailModal({ isOpen, onClose, title, fields = [] }) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div className="bg-card p-6 rounded-lg max-w-md w-full border border-border space-y-4">
        <h3 className="text-lg font-bold">{title}</h3>
        <div className="space-y-2 text-sm">
          {fields.map(({ label, value }, i) => (
            <p key={i}>
              <strong>{label}:</strong> {value ?? 'N/A'}
            </p>
          ))}
        </div>
        <div className="flex justify-end pt-4">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-primary text-primary-foreground rounded-lg text-sm font-medium"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
}
