import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import '../styles/Dashboard.css'

function Dashboard() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const token = localStorage.getItem('token')

    if (!token || !storedUser) {
      navigate('/login')
      return
    }

    try {
      const userData = JSON.parse(storedUser)
      setUser(userData)
    } catch (err) {
      console.error('Error parsing user data:', err)
      navigate('/login')
    } finally {
      setLoading(false)
    }
  }, [navigate])

  const handleLogout = () => {
    localStorage.removeItem('token')
    localStorage.removeItem('user')
    navigate('/login')
  }

  if (loading) {
    return (
      <div className="dashboard-container">
        <div className="loading">Loading...</div>
      </div>
    )
  }

  if (!user) {
    return null
  }

  return (
    <div className="dashboard-container">
      <nav className="navbar">
        <div className="navbar-brand">SACE</div>
        <div className="navbar-content">
          <span className="user-name">Welcome, {user.name}</span>
          <button onClick={handleLogout} className="logout-btn">
            Logout
          </button>
        </div>
      </nav>

      <main className="dashboard-main">
        <div className="dashboard-header">
          <h1>Dashboard</h1>
          <p>You are successfully logged in!</p>
        </div>

        <div className="dashboard-content">
          <div className="card">
            <h2>User Information</h2>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p><strong>Role:</strong> {user.role || 'User'}</p>
            <p><strong>Provider:</strong> {user.provider || 'Local'}</p>
            {user.profileImageUrl && (
              <div className="profile-image">
                <img 
                  src={user.profileImageUrl} 
                  alt="Profile" 
                  style={{ maxWidth: '100px', borderRadius: '8px' }}
                />
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  )
}

export default Dashboard
