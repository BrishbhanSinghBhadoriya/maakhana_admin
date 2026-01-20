import api from '@/lib/axios';

export interface AdminUser {
    id: string;
    email: string;
    name: string;
    role: string;
}

export interface LoginResponse {
    accessToken: string;
    user: AdminUser;
}

/**
 * Login admin and receive access token
 */
export const login = async (credentials: Record<string, any>): Promise<LoginResponse> => {
    const { data } = await api.post<LoginResponse>('/admin/login', credentials);
    return data;
};

/**
 * Logout admin and clear tokens
 */
export const logout = async (): Promise<void> => {
    await api.post('/admin/logout');
};

/**
 * Refresh access token using the refresh cookie
 */
export const refresh = async (): Promise<{ accessToken: string; user: AdminUser }> => {
    const { data } = await api.post('/admin/refresh');
    return data;
};
