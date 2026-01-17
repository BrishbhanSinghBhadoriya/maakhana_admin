import api from '@/lib/axios';
import { User } from '@/Types/User.types';

export const login = async (payload: Partial<User>) => {
  
  const { data } = await api.post('/admin/login', payload);
  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};
