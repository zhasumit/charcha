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

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) return <PageLoader theme="dark" className="text-primary" size={40} />

  return (
    <>
      <div className='h-screen' data-theme="dark">
        <Routes>
          <Route path='/'
            element=
            {isAuthenticated && isOnboarded ?
              (<HomePage />) :
              (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)
            } />
          <Route path='/signup' element={!isAuthenticated ? <SignUpPage /> : <Navigate to="/" />} />
          <Route path='/login' element={!isAuthenticated ? <LoginPage /> : <Navigate to="/" />} />
          <Route path='/notifications' element={isAuthenticated ? <NotificationsPage /> : <Navigate to="/login" />} />
          <Route path='/call' element={isAuthenticated ? <CallPage /> : <Navigate to="/login" />} />
          <Route path='/chat' element={isAuthenticated ? <ChatPage /> : <Navigate to="/login" />} />
          <Route path="/onboarding"
            element=
            {!isAuthenticated ?
              <Navigate to="/login" /> :
              isOnboarded ? <Navigate to="/" /> : <OnboardingPage />}
          />
        </Routes>

        <Toaster />
      </div>
    </>
  )
}

export default App
