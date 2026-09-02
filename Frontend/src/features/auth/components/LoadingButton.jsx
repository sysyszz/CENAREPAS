// components/LoadingButton.jsx

export const LoadingButton = ({
  isLoading,
  onClick,
  type = 'submit',
  disabled,
  children,
  className = '',
}) => (
  <button
    type={type}
    onClick={onClick}
    disabled={isLoading || disabled}
    className={`w-full bg-primary text-primary-foreground py-2 rounded-lg hover:opacity-90 transition-opacity disabled:opacity-50 flex items-center justify-center gap-2 ${className}`}
  >
    {isLoading ? (
      <>
        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
        Cargando...
      </>
    ) : (
      children
    )}
  </button>
);