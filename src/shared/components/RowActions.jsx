import { Eye, Edit, Trash2, XCircle } from 'lucide-react';

const mutedButtonClass =
  'inline-flex items-center justify-center p-1.5 rounded-lg text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer';
const plainButtonClass =
  'inline-flex items-center justify-center p-1.5 rounded-lg hover:bg-muted transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer';
const deleteButtonClass =
  'inline-flex items-center justify-center p-1.5 rounded-lg text-destructive hover:bg-destructive/10 transition-colors disabled:opacity-40 disabled:pointer-events-none cursor-pointer';

function wrapNode(wrapper, node) {
  return wrapper ? wrapper(node) : node;
}

export function RowActions({
  onView,
  onEdit,
  onDelete,
  viewDisabled,
  editDisabled,
  deleteDisabled,
  viewTitle = 'Ver detalle',
  editTitle = 'Editar',
  deleteTitle = 'Eliminar',
  showView = true,
  showEdit,
  showDelete,
  deleteIcon = 'trash',
  extra,
  variant = 'muted',
  gap = 1,
  wrapView,
  wrapEdit,
  wrapDelete,
}) {
  const actionClass = variant === 'plain' ? plainButtonClass : mutedButtonClass;
  const shouldShowEdit = showEdit ?? Boolean(onEdit);
  const shouldShowDelete = showDelete ?? Boolean(onDelete);
  const DeleteIcon = deleteIcon === 'x' ? XCircle : Trash2;

  const viewButton = (
    <button
      type="button"
      onClick={onView}
      disabled={viewDisabled}
      className={actionClass}
      title={viewTitle || undefined}
      aria-label={viewTitle}
    >
      <Eye className="w-4 h-4 shrink-0" />
    </button>
  );

  const editButton = (
    <button
      type="button"
      onClick={onEdit}
      disabled={editDisabled}
      className={actionClass}
      title={editTitle || undefined}
      aria-label={editTitle}
    >
      <Edit className="w-4 h-4 shrink-0" />
    </button>
  );

  const deleteButton = (
    <button
      type="button"
      onClick={onDelete}
      disabled={deleteDisabled}
      className={deleteButtonClass}
      title={deleteTitle || undefined}
      aria-label={deleteTitle}
    >
      <DeleteIcon className="w-4 h-4 shrink-0" />
    </button>
  );

  return (
    <div className={`flex items-center ${gap === 2 ? 'gap-2' : 'gap-1'}`}>
      {showView ? wrapNode(wrapView, viewButton) : null}
      {shouldShowEdit ? wrapNode(wrapEdit, editButton) : null}
      {extra}
      {shouldShowDelete ? wrapNode(wrapDelete, deleteButton) : null}
    </div>
  );
}
