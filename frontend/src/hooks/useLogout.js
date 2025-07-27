import { useMutation, useQueryClient } from '@tanstack/react-query';
import React from 'react'
import { customToast } from '../lib/customToast';
import { logout } from '../lib/api';

const useLogout = () => {
    const queryClient = useQueryClient();

    const { mutate, isPending, error } = useMutation({
        mutationFn: logout,
        onSuccess: (_data, _vars, context) => {
            customToast.warning("Logged out successfully");
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            context?.onSuccess?.();
        },
    });

    const logoutMutation = (options = {}) => {
        mutate(undefined, {
            context: { onSuccess: options.onSuccess },
        });
    };

    return { logoutMutation, isPending, error };
}

export default useLogout