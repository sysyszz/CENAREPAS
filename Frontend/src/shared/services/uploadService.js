import { api } from './api';

export async function uploadImage(file) {
  const formData = new FormData();
  formData.append('imagen', file);
  return api.post('/uploads/imagen', formData);
}
