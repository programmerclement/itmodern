import { axiosClient } from '../api/axiosClient.js';

export const uploadImage = (file, folder) => {
  const formData = new FormData();
  formData.append('image', file);
  if (folder) formData.append('folder', folder);
  return axiosClient.post('/uploads/image', formData);
};
