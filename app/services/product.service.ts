import api from '@/lib/axios';

export const getProducts = async () => {
  const { data } = await api.get('/menu/get-menu');
  return data;
};

export const updateMenu = async (id: string, data: any) => {
  const response = await api.patch(`/menu/update-menu/${id}`, data);
  return response.data;
};
