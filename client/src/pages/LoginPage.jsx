import React, { useState, useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function LoginPage() {
  const { login } = useContext(AuthContext)
  const [form, setForm] = useState({ email: '', password: '' })
  const [error, setError] = useState(null)

  function handleChange(e) {
    setForm(prev => ({ ...prev, [e.target.name]: e.target.value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    try {
      await login(form)
    } catch {
      setError('Invalid credentials.')
    }
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Welcome back</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit} className="mx-auto" style={{ maxWidth: 400 }}>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" name="email" className="form-control form-control-lg" value={form.email} onChange={handleChange} required />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input type="password" name="password" className="form-control form-control-lg" value={form.password} onChange={handleChange} required />
        </div>
        <button type="submit" className="btn btn-primary btn-lg w-100">Log In</button>
      </form>
      <p className="mt-3 text-center">Don't have an account? <NavLink to="/signup">Sign up</NavLink>.</p>
    </div>
  )
}