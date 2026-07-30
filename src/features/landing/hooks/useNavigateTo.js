// hooks/useNavigateTo.js
import { useNavigate } from 'react-router-dom';

export const useNavigateTo = (path) => {
  const navigate = useNavigate();

  return () => navigate(path);
};