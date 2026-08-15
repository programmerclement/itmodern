import { axiosClient } from '../api/axiosClient.js';

function toFormData(file) {
  const formData = new FormData();
  formData.append('file', file);
  return formData;
}

export const previewImport = (file) => axiosClient.post('/products/import/preview', toFormData(file));

export const commitImport = (file) => axiosClient.post('/products/import/commit', toFormData(file));
