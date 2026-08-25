export default function RowActions({ actions, className = 'flex items-center gap-1' }) {
  return (
    <div className={className}>
      {actions.filter((action) => !action.hidden && action.permission !== false).map((action) => {
        const Icon = action.icon;

        return (
          <button
            key={action.key}
            type="button"
            onClick={action.onClick}
            disabled={action.disabled}
            className={action.className || 'p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground'}
            title={action.title}
            aria-label={action.title}
          >
            <Icon className={action.iconClassName || 'w-4 h-4'} />
          </button>
        );
      })}
    </div>
  );
}
