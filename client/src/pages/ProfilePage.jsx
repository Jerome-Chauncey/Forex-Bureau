import React, { useEffect, useState, useContext } from 'react'
import API from '../api'
import { AuthContext } from '../contexts/AuthContext'

export default function ProfilePage() {
  const { logout } = useContext(AuthContext)
  const [user, setUser] = useState(null)

  useEffect(() => {
    API.get('/users/me').then(res => setUser(res.data))
  }, [])

  if (!user) return <div className="container py-5">Loading...</div>

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Profile</h2>
      <p><strong>Name:</strong> {user.name}</p>
      <p><strong>Email:</strong> {user.email}</p>
      <button onClick={logout} className="btn btn-secondary mt-3">Logout</button>
    </div>
  )
}
