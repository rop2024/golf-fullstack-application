import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import LoadingSpinner from './components/LoadingSpinner'

// Lazy load all page components for code splitting
const Login = React.lazy(() => import('./pages/Login'))
const Signup = React.lazy(() => import('./pages/Signup'))
const Dashboard = React.lazy(() => import('./pages/Dashboard'))
const Scores = React.lazy(() => import('./pages/Scores'))
const Draw = React.lazy(() => import('./pages/Draw'))
const Winners = React.lazy(() => import('./pages/Winners'))
const Subscription = React.lazy(() => import('./pages/Subscription'))
const Admin = React.lazy(() => import('./pages/Admin'))

function App() {
  console.log('[Client] App component rendering...');
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/draw" element={<Draw />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App