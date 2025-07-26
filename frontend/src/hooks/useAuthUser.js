import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getAuthUser } from '../lib/api'

// This user is coming from server.js -> api/auth/me and it is returning 
// {success:true, user: req.user} (API that checks if there is user logged in)
const useAuthUser = () => {
    const authUser = useQuery({
        // used for fetching and refetching using useMutation in the signup page
        queryKey: ["authUser"],
        queryFn: getAuthUser,
        retry: false,
    })

    // return the isLoading and the data of the user if it exists (other wise undefined)
    return { isLoading: authUser.isLoading, authUser: authUser.data?.user }
}

export default useAuthUser