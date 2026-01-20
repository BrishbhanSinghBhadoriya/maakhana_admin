'use client';

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { setAccessToken } from '@/lib/axios';
import * as adminService from '@/app/services/admin.service';

interface AuthContextType {
    user: adminService.AdminUser | null;
    isLoading: boolean;
    login: (credentials: Record<string, any>) => Promise<void>;
    logout: () => Promise<void>;
    isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<adminService.AdminUser | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const router = useRouter();

    const handleLogout = useCallback(async () => {
        try {
            await adminService.logout();
        } catch (error) {
            console.error('Logout error:', error);
        } finally {
            setUser(null);
            setAccessToken(null);
            router.push('/login');
        }
    }, [router]);

    // Silent refresh on app startup
    useEffect(() => {
        const initAuth = async () => {
            try {
                const data = await adminService.refresh();
                setUser(data.user);
                setAccessToken(data.accessToken);
            } catch (error) {
                console.log('No active session found.');
            } finally {
                setIsLoading(false);
            }
        };

        initAuth();
    }, []);

    // Listen for auth expiration events from axios interceptor
    useEffect(() => {
        const onAuthExpired = () => {
            setUser(null);
            setAccessToken(null);
            router.push('/login?reason=session_expired');
        };

        window.addEventListener('auth:expired', onAuthExpired);
        return () => window.removeEventListener('auth:expired', onAuthExpired);
    }, [router]);

    const login = async (credentials: Record<string, any>) => {
        try {
            const data = await adminService.login(credentials);
            setUser(data.user);
            setAccessToken(data.accessToken);
            router.push('/');
        } catch (error) {
            throw error;
        }
    };

    const logout = async () => {
        await handleLogout();
    };

    return (
        <AuthContext.Provider
            value={{
                user,
                isLoading,
                login,
                logout,
                isAuthenticated: !!user,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
}
