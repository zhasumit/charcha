import { Routes, Route } from 'react-router'
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
  const { data, isLoading, error } = useQuery({
    queryKey: ["todos"],
    queryFn: async () => {
      const res = await axiosInstance.get("/auth/me")
      return res.data
    },
    retry: false // auth check
  })

  console.log({ data })
  return (
    <>
      <div className='h-screen' data-theme="sunset">
        <Routes>
          <Route path='/' element={<HomePage />} />
          <Route path='/signup' element={<SignUpPage />} />
          <Route path='/login' element={<LoginPage />} />
          <Route path='/notifications' element={<NotificationsPage />} />
          <Route path='/call' element={<CallPage />} />
          <Route path='/chat' element={<ChatPage />} />
          <Route path='/onboarding' element={<OnboardingPage />} />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
