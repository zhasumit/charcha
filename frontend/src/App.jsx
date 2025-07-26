import { Routes, Route, Navigate } from 'react-router'
import HomePage from './pages/HomePage'
import SignUpPage from './pages/SignUpPage'
import LoginPage from './pages/LoginPage'
import NotificationsPage from './pages/NotificationsPage'
import CallPage from './pages/CallPage'
import ChatPage from './pages/ChatPage'
import OnboardingPage from './pages/OnboardingPage'
import { Toaster } from "react-hot-toast"
import PageLoader from './components/PageLoader'
import useAuthUser from './hooks/useAuthUser'
const App = () => {

  const { isLoading, authUser } = useAuthUser();
  if (isLoading) return <PageLoader theme="dark" className="text-primary" size={40} />

  return (
    <>
      <div className='h-screen' data-theme="dark">
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
