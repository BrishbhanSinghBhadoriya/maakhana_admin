'use client';

import { useMutation, useQueryClient } from '@tanstack/react-query';
import { login } from '@/app/services/user.service';
import { toast } from 'sonner';

export function useLogin() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: login,

    onSuccess: async () => {
   
      await queryClient.invalidateQueries({
        queryKey: ['me'],
      });
    },
    onError: (error: any) => {
      const message =
        error?.response?.data?.message || 'Invalid credentials';
      toast.error(message);
    },
  });
}
