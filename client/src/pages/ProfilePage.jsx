import React, { useState, useEffect, useContext } from 'react'
import API from '../api'
import { AuthContext } from '../contexts/AuthContext'
import Footer from '../components/Footer'

export default function ProfilePage() {
  const { logout } = useContext(AuthContext)
  const [user, setUser] = useState(null)
  const [form, setForm] = useState({ phone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState(null)

  useEffect(() => {
    API.get('/api/users/me')
      .then(res => {
        setUser(res.data)
        setForm({ phone: res.data.phone || '', address: res.data.address || '' })
      })
      .catch(err => {
        console.error(err)
        if (err.response?.status === 401) logout()
        else setError('Failed to load profile.')
      })
      .finally(() => setLoading(false))
  }, [logout])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSave(e) {
    e.preventDefault()
    setError(null)
    setSaving(true)
    try {
      const res = await API.patch('/api/users/me', form)
      setUser(res.data)
    } catch (err) {
      if (err.response?.status === 401) logout()
      else setError(err.response?.data?.message || 'Failed to update profile.')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <div className="container py-5">Loading profile…</div>

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Profile</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      <form onSubmit={handleSave} style={{ maxWidth: 600 }}>
        <div className="mb-3">
          <label className="form-label">Name</label>
          <input type="text" className="form-control" value={user.name} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Email</label>
          <input type="email" className="form-control" value={user.email} readOnly />
        </div>
        <div className="mb-3">
          <label className="form-label">Phone</label>
          <input
            name="phone"
            className="form-control"
            value={form.phone}
            onChange={handleChange}
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Address</label>
          <input
            name="address"
            className="form-control"
            value={form.address}
            onChange={handleChange}
          />
        </div>
        <button type="submit" className="btn btn-primary me-2" disabled={saving}>
          {saving ? 'Saving…' : 'Save Changes'}
        </button>
        <button type="button" onClick={logout} className="btn btn-secondary">
          Logout
        </button>
      </form>
      <Footer />
    </div>
  )
}
