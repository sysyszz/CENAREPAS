import { Eye, Edit, Trash2, XCircle } from 'lucide-react';

const mutedButtonClass =
  'p-2 hover:bg-muted rounded-lg text-muted-foreground hover:text-foreground';
const plainButtonClass = 'p-2 hover:bg-muted rounded-lg';
const deleteButtonClass = 'p-2 hover:bg-muted rounded-lg text-destructive';

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
    >
      <Eye className="w-4 h-4" />
    </button>
  );

  const editButton = (
    <button
      type="button"
      onClick={onEdit}
      disabled={editDisabled}
      className={actionClass}
      title={editTitle || undefined}
    >
      <Edit className="w-4 h-4" />
    </button>
  );

  const deleteButton = (
    <button
      type="button"
      onClick={onDelete}
      disabled={deleteDisabled}
      className={deleteButtonClass}
      title={deleteTitle || undefined}
    >
      <DeleteIcon className="w-4 h-4" />
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
