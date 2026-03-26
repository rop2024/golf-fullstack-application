import React, { Suspense } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import Home from './Home'
import LoadingSpinner from './components/LoadingSpinner'
import AdminGuard from './components/AdminGuard'

// Lazy load all page components for code splitting
const Landing = React.lazy(() => import('./pages/Landing'))
const Login = React.lazy(() => import('./pages/Login'))
const Signup = React.lazy(() => import('./pages/Signup'))
const Features = React.lazy(() => import('./pages/Features'))
const Pricing = React.lazy(() => import('./pages/Pricing'))
const HowItWorks = React.lazy(() => import('./pages/HowItWorks'))
const HelpCenter = React.lazy(() => import('./pages/HelpCenter'))
const Contact = React.lazy(() => import('./pages/Contact'))
const Privacy = React.lazy(() => import('./pages/Privacy'))
const Terms = React.lazy(() => import('./pages/Terms'))
const Cookies = React.lazy(() => import('./pages/Cookies'))
const Legal = React.lazy(() => import('./pages/Legal'))
const Scores = React.lazy(() => import('./pages/Scores'))
const Draw = React.lazy(() => import('./pages/Draw'))
const Winners = React.lazy(() => import('./pages/Winners'))
const Subscription = React.lazy(() => import('./pages/Subscription'))
const Settings = React.lazy(() => import('./pages/Settings'))
const Admin = React.lazy(() => import('./pages/Admin'))
const Success = React.lazy(() => import('./pages/Success'))
const Cancel = React.lazy(() => import('./pages/Cancel'))

function App() {
  console.log('[Client] App component rendering...');
  return (
    <AuthProvider>
      <Router>
        <Suspense fallback={<LoadingSpinner fullScreen />}>
          <Routes>
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/features" element={<Features />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/how-it-works" element={<HowItWorks />} />
            <Route path="/help" element={<HelpCenter />} />
            <Route path="/contact" element={<Contact />} />
            <Route path="/privacy" element={<Privacy />} />
            <Route path="/terms" element={<Terms />} />
            <Route path="/cookies" element={<Cookies />} />
            <Route path="/legal" element={<Legal />} />
            <Route path="/dashboard" element={<Home />} />
            <Route path="/scores" element={<Scores />} />
            <Route path="/draw" element={<Draw />} />
            <Route path="/winners" element={<Winners />} />
            <Route path="/subscription" element={<Subscription />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/success" element={<Success />} />
            <Route path="/cancel" element={<Cancel />} />
            <Route path="/admin" element={<AdminGuard><Admin /></AdminGuard>} />
          </Routes>
        </Suspense>
      </Router>
    </AuthProvider>
  )
}

export default App