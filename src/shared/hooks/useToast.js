import { useState, useCallback } from 'react';

export function useToast() {
  const [toast, setToast] = useState({ isOpen: false, type: 'success', message: '' });

  const showToast = useCallback((message, type = 'success') => {
    setToast({ isOpen: true, type, message });
  }, []);

  const hideToast = useCallback(() => {
    setToast(prev => ({ ...prev, isOpen: false }));
  }, []);

  return { toast, setToast, showToast, hideToast };
}
