import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { GoogleOAuthProvider } from '@react-oauth/google'
import Login from './pages/Login'
import Dashboard from './pages/Dashboard'
import './App.css'

// Google OAuth Client ID
const GOOGLE_CLIENT_ID = '742815630040-7o1redrna3nfr61giflrhch9erinf8a2.apps.googleusercontent.com'

function App() {
  return (
    <GoogleOAuthProvider clientId={GOOGLE_CLIENT_ID}>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </GoogleOAuthProvider>
  )
}

export default App
