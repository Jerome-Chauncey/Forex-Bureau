import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import API from '../api'  
import Footer from '../components/Footer'

export default function SignupPage() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    name: '', email: '', password: '',
    phone: '', address: '', kycFile: null
  })
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  function handleChange(e) {
    const { name, value, files } = e.target
    setForm(f => ({
      ...f,
      [name]: files ? files[0] : value
    }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    const { name, email, password, phone, address, kycFile } = form
    if (!name||!email||!password||!phone||!address||!kycFile) {
      setError('All fields are required.')
      return
    }
    setLoading(true); setError(null)
    // build multipart
    const data = new FormData()
    Object.entries({ name, email, password, phone, address }).forEach(
      ([k,v]) => data.append(k, v)
    )
    data.append('kycDoc', kycFile)
    try {
      await API.post('/api/signup', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      })
      navigate('/login')
    } catch (e) {
      setError(e.response?.data?.message || 'Signup failed.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Sign Up</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label className="form-label">Full Name</label>
          <input name="name" value={form.name}
            onChange={handleChange}
            className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input name="email" type="email" value={form.email}
            onChange={handleChange}
            className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Password</label>
          <input name="password" type="password" value={form.password}
            onChange={handleChange}
            className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input name="phone" value={form.phone}
            onChange={handleChange}
            className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input name="address" value={form.address}
            onChange={handleChange}
            className="form-control" />
        </div>
        <div className="mb-3">
          <label className="form-label">Upload ID (PDF, JPG, PNG)</label>
          <input name="kycFile" type="file"
            accept=".pdf,.jpg,.jpeg,.png"
            onChange={handleChange}
            className="form-control" />
        </div>
        <button type="submit"
          className="btn btn-primary"
          disabled={loading}>
          {loading ? 'Signing Up…' : 'Sign Up'}
        </button>
      </form>
      <p className="mt-3">
        Already have an account? <Link to="/login">Log in here</Link>.
      </p>
      <Footer />
    </div>
  )
}