import api from '@/lib/axios';
import { User } from '@/Types/User.types';
import Cookies from 'js-cookie';

export const login = async (payload: Partial<User>) => {
  const { data } = await api.post('/admin/login', payload, { withCredentials: true });

  // Set token in cookies
  if (data.token) {
    Cookies.set('token', data.token, {
      expires: 1, // 1 day
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    });
  }

  return data;
};

export const getProfile = async () => {
  const { data } = await api.get('/auth/me');
  return data;
};

export const logout = async () => {
  await api.post('/auth/logout');
};
