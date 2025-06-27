import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import API from '../api'
import { AuthContext } from './AuthContext'

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem('jwt'))
  const navigate = useNavigate()

  useEffect(() => {
    if (token) {
      API.defaults.headers.common['Authorization'] = `Bearer ${token}`
      localStorage.setItem('jwt', token)
    } else {
      delete API.defaults.headers.common['Authorization']
      localStorage.removeItem('jwt')
    }
  }, [token])

  const login = async (credentials) => {
    const res = await API.post('/api/login', credentials)
    setToken(res.data.token)
    navigate('/rates')
  }

  const logout = () => {
    setToken(null)
    navigate('/login')
  }

  return (
    <AuthContext.Provider value={{ token, login, logout }}>
      {children}
    </AuthContext.Provider>
  )
}