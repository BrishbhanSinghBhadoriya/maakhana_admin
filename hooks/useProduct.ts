'use client';

import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getProducts, updateMenu } from '@/app/services/product.service';
import { toast } from 'sonner';

export const useGetProducts = () => {
    return useQuery({
        queryKey: ['products'],
        queryFn: getProducts,
    });
};

export const useUpdateMenu = () => {
    const queryClient = useQueryClient();

    return useMutation({
        mutationFn: ({ id, data }: { id: string; data: any }) => updateMenu(id, data),
        onSuccess: () => {
            toast.success('Menu updated successfully');
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: (error: any) => {
            toast.error(error.message || 'Failed to update menu');
        },
    });
};