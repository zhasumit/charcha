import { Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import { Toaster } from "react-hot-toast"
import { useQuery } from '@tanstack/react-query'
import axios from "axios"
import { axiosInstance } from './lib/axios'

// axios will be for talking to the backend 
// tenstack query will fetch the data (get) and delete (put, patch, delete) requests
const App = () => {

  const { data: authData, isLoading, error } = useQuery({
    queryKey: ["authUser"], // used for fetching and refetching using useMutation in the signup page
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me")
      return res.data
    },
    retry: false,
  })

  // This is coming from server.js -> api/auth/me and it is returning 
  // {success:true, user: req.user} (API that checks if there is user logged in)
  const authUser = authData?.user

  return (
    <>
      <div className='h-screen' data-theme="sunset">
        <Routes>
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />} />
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/notifications' element={authUser ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path='/call' element={authUser ? <CallPage /> : <Navigate to="/login" />} />
          <Route path='/chat' element={authUser ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path='/onboarding' element={authUser ? <OnboardingPage /> : <Navigate to="/login" />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
