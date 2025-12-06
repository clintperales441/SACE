import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import axios from 'axios'
import { GoogleLogin } from '@react-oauth/google'
import '../styles/Login.css'

function Login() {
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const [showSignup, setShowSignup] = useState(false)
  const [signupData, setSignupData] = useState({
    name: '',
    email: '',
    password: '',
    passwordConfirm: ''
  })
  const [signupError, setSignupError] = useState('')

  // Configure axios base URL
  const API_BASE_URL = 'http://localhost:8080'
  const axiosInstance = axios.create({
    baseURL: API_BASE_URL
  })

  const handleLogin = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await axiosInstance.post('/api/auth/login', {
        email,
        password,
      })

      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleSignup = async (e) => {
    e.preventDefault()
    setSignupError('')
    setLoading(true)

    if (signupData.password !== signupData.passwordConfirm) {
      setSignupError('Passwords do not match')
      setLoading(false)
      return
    }

    try {
      const response = await axiosInstance.post('/api/auth/signup', {
        name: signupData.name,
        email: signupData.email,
        password: signupData.password,
        passwordConfirm: signupData.passwordConfirm
      })

      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setSignupError(err.response?.data?.message || 'Signup failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleSuccess = async (credentialResponse) => {
    setError('')
    setLoading(true)

    try {
      // Send the credential to the backend
      const response = await axiosInstance.post('/api/auth/google', {
        token: credentialResponse.credential
      })

      // Store token and user in localStorage
      localStorage.setItem('token', response.data.token)
      localStorage.setItem('user', JSON.stringify(response.data.user))

      // Redirect to dashboard
      navigate('/dashboard')
    } catch (err) {
      setError('Google login failed. Please try again.')
      console.error('Google login error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleError = () => {
    setError('Google login failed. Please try again.')
  }

  const handleSignupChange = (e) => {
    const { name, value } = e.target
    setSignupData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  return (
    <div className="login-container">
      <div className="login-box">
        <h1>SACE</h1>
        <h2>{showSignup ? 'Create Account' : 'Login'}</h2>
        
        {!showSignup ? (
          <>
            {/* Login Form */}
            <form onSubmit={handleLogin}>
              <div className="form-group">
                <label htmlFor="email">Email</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="password">Password</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter your password"
                />
              </div>

              {error && <div className="error-message">{error}</div>}

              <button type="submit" disabled={loading}>
                {loading ? 'Logging in...' : 'Login'}
              </button>
            </form>

            {/* Google Login Button */}
            <div className="google-login-section">
              <div className="divider">
                <span>Or continue with</span>
              </div>
              <div className="google-button-wrapper">
                <GoogleLogin
                  onSuccess={handleGoogleSuccess}
                  onError={handleGoogleError}
                  theme="outline"
                  size="large"
                  text="signin_with"
                />
              </div>
            </div>

            {/* Signup Link */}
            <p className="signup-link">
              Don't have an account?{' '}
              <button 
                type="button" 
                className="link-button"
                onClick={() => {
                  setShowSignup(true)
                  setError('')
                  setSignupError('')
                }}
              >
                Sign up here
              </button>
            </p>
          </>
        ) : (
          <>
            {/* Signup Form */}
            <form onSubmit={handleSignup}>
              <div className="form-group">
                <label htmlFor="name">Full Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={signupData.name}
                  onChange={handleSignupChange}
                  required
                  placeholder="Enter your full name"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-email">Email</label>
                <input
                  type="email"
                  id="signup-email"
                  name="email"
                  value={signupData.email}
                  onChange={handleSignupChange}
                  required
                  placeholder="Enter your email"
                />
              </div>

              <div className="form-group">
                <label htmlFor="signup-password">Password</label>
                <input
                  type="password"
                  id="signup-password"
                  name="password"
                  value={signupData.password}
                  onChange={handleSignupChange}
                  required
                  placeholder="Enter your password"
                />
              </div>

              <div className="form-group">
                <label htmlFor="confirm-password">Confirm Password</label>
                <input
                  type="password"
                  id="confirm-password"
                  name="passwordConfirm"
                  value={signupData.passwordConfirm}
                  onChange={handleSignupChange}
                  required
                  placeholder="Confirm your password"
                />
              </div>

              {signupError && <div className="error-message">{signupError}</div>}

              <button type="submit" disabled={loading}>
                {loading ? 'Creating Account...' : 'Sign Up'}
              </button>
            </form>

            {/* Back to Login */}
            <p className="signup-link">
              Already have an account?{' '}
              <button 
                type="button" 
                className="link-button"
                onClick={() => {
                  setShowSignup(false)
                  setError('')
                  setSignupError('')
                  setEmail('')
                  setPassword('')
                }}
              >
                Login here
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  )
}

export default Login
