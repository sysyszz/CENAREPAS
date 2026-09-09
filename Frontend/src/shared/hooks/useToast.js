import { useCallback } from 'react';
import { toast } from '../utils/toast';

export function useToast() {
  const showToast = useCallback((message, type = 'success', options = {}) => {
    if (type === 'success') {
      toast.success(message, options);
    } else if (type === 'error') {
      toast.error(message, options);
    } else if (type === 'warning') {
      toast.warning(message, options);
    } else {
      toast.info(message, options);
    }
  }, []);

  const hideToast = useCallback((id) => {
    toast.dismiss(id);
  }, []);

  return { toast, showToast, hideToast };
}

export { toast };
export default useToast;
