import { signup } from '../lib/api';
import { useMutation, useQueryClient } from '@tanstack/react-query';

// queryCLient is from the app.jsx and sending and getting the authUser using mutation 
const useSignup = () => {
    const queryClient = useQueryClient();
    
    const { mutate, isPending, error } = useMutation({
        mutationFn: signup,
        onSuccess: () => queryClient.invalidateQueries({ queryKey: ["authUser"] }),
        // refetch the query in the app.jsx with the queryKey as authUser
    })
    return { isPending, error, signupMutation: mutate }
}

export default useSignup