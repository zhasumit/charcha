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
import Layout from './components/Layout'
import { useThemeStore } from './store/useThemeStore'
const App = () => {

  const { isLoading, authUser } = useAuthUser();
  const { theme } = useThemeStore()

  const isAuthenticated = Boolean(authUser)
  const isOnboarded = authUser?.isOnboarded

  if (isLoading) return <PageLoader theme={theme} className="text-primary" size={45} />

  return (
    <>
      <div className='h-screen' data-theme={theme}>
        <Toaster position="top-right" />
        <Routes>
          <Route path='/'
            element=
            {isAuthenticated && isOnboarded ?
              (
                <Layout showSidebar={true}>
                  <HomePage />
                </Layout>
              ) :  // go to the home page if authenticated and onboarded
              (<Navigate to={!isAuthenticated ? "/login" : "/onboarding"} />)
            } />

          <Route path="/signup"
            element={
              !isAuthenticated ? <SignUpPage /> : // go to the signup page if not authenticated
                <Navigate to={isOnboarded ? "/" : "/onboarding"} /> // go to / if onboarded otherwise onboard first
            }
          />

          <Route path="/login"
            element={
              !isAuthenticated ? <LoginPage /> :  // go to the login page if not authenticated
                <Navigate to={isOnboarded ? "/" : "/onboarding"} /> // go to / if onboarded otherwise onboard first
            }
          />

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

      </div>
    </>
  )
}

export default App
