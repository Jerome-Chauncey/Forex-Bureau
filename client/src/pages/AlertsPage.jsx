import React, { useEffect, useState, useContext } from 'react'
import API from '../api'
import { AuthContext } from '../contexts/AuthContext'
import Footer from '../components/Footer'

export default function AlertsPage() {
  const { logout } = useContext(AuthContext)
  const [alerts, setAlerts] = useState([])
  const [pairsMap, setPairsMap] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  // form state for new alert
  const [newAlert, setNewAlert] = useState({
    currency_pair_id: '',
    target_rate: '',
    is_active: true
  })

  // for editing an existing alert
  const [editingId, setEditingId] = useState(null)
  const [editData, setEditData] = useState({ target_rate: '', is_active: false })

  useEffect(() => {
    Promise.all([API.get('/api/alerts'), API.get('/api/rates')])
      .then(([alertsRes, ratesRes]) => {
        setAlerts(alertsRes.data)
        const map = {}
        ratesRes.data.forEach(p => {
          map[p.id] = `${p.base_currency}/${p.quote_currency}`
        })
        setPairsMap(map)
        // pick a default for new-alert select
        setNewAlert(na => ({
          ...na,
          currency_pair_id: ratesRes.data[0]?.id ?? ''
        }))
      })
      .catch(err => {
        console.error(err)
        if (err.response?.status === 401) logout()
        else setError('Failed to load alerts.')
      })
      .finally(() => setLoading(false))
  }, [logout])

  // Create
  const handleCreate = e => {
    e.preventDefault()
    API.post('/api/alerts', newAlert)
      .then(res => {
        setAlerts([ ...alerts, res.data ])
        setNewAlert({ ...newAlert, target_rate: '' })
      })
      .catch(() => setError('Failed to create alert.'))
  }

  // Delete
  const handleDelete = id => {
    if (!window.confirm('Delete this alert?')) return
    API.delete(`/api/alerts/${id}`)
      .then(() => {
        setAlerts(alerts.filter(a => a.id !== id))
        if (editingId === id) setEditingId(null)
      })
      .catch(() => setError('Failed to delete alert.'))
  }

  // Start edit
  const startEdit = a => {
    setEditingId(a.id)
    setEditData({ target_rate: a.target_rate, is_active: a.is_active })
  }

  // Cancel edit
  const cancelEdit = () => {
    setEditingId(null)
    setEditData({ target_rate: '', is_active: false })
  }

  // Save edit
  const saveEdit = id => {
    API.patch(`/api/alerts/${id}`, editData)
      .then(res => {
        setAlerts(alerts.map(a => a.id === id ? res.data : a))
        cancelEdit()
      })
      .catch(() => setError('Failed to update alert.'))
  }

  if (loading) return <div className="container py-5">Loading alerts…</div>
  if (error)   return <div className="container py-5 alert alert-danger">{error}</div>

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <div className="container py-5 flex-grow-1">
        <h2 className="mb-4">My Alerts</h2>

        {/*Create New Alert */}
        <form className="row g-2 align-items-end mb-4" onSubmit={handleCreate}>
          <div className="col-auto">
            <label className="form-label">Pair</label>
            <select
              className="form-select"
              value={newAlert.currency_pair_id}
              onChange={e => setNewAlert({ ...newAlert, currency_pair_id: e.target.value })}
            >
              {Object.entries(pairsMap).map(([id, label]) =>
                <option key={id} value={id}>{label}</option>
              )}
            </select>
          </div>
          <div className="col-auto">
            <label className="form-label">Target Rate</label>
            <input
              type="number"
              step="0.0001"
              className="form-control"
              value={newAlert.target_rate}
              onChange={e => setNewAlert({ ...newAlert, target_rate: e.target.value })}
              required
            />
          </div>
          <div className="col-auto form-check form-switch">
            <input
              type="checkbox"
              className="form-check-input"
              id="newAlertActive"
              checked={newAlert.is_active}
              onChange={e => setNewAlert({ ...newAlert, is_active: e.target.checked })}
            />
            <label className="form-check-label" htmlFor="newAlertActive">Active</label>
          </div>
          <div className="col-auto">
            <button type="submit" className="btn btn-success">Add Alert</button>
          </div>
        </form>

        {/*  Alerts Table */}
        <table className="table table-striped">
          <thead className="table-light">
            <tr>
              <th>ID</th>
              <th>Pair</th>
              <th>Target Rate</th>
              <th>Active</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {alerts.map(a => (
              <tr key={a.id}>
                <td>#{a.id}</td>
                <td>{pairsMap[a.currency_pair_id]}</td>

                
                <td>
                  {editingId === a.id
                    ? <input
                        type="number"
                        step="0.0001"
                        className="form-control form-control-sm"
                        value={editData.target_rate}
                        onChange={e => setEditData({ ...editData, target_rate: e.target.value })}
                      />
                    : a.target_rate
                  }
                </td>
                <td>
                  {editingId === a.id
                    ? <div className="form-check form-switch">
                        <input
                          className="form-check-input"
                          type="checkbox"
                          checked={editData.is_active}
                          onChange={e => setEditData({ ...editData, is_active: e.target.checked })}
                        />
                      </div>
                    : (a.is_active ? 'Yes' : 'No')
                  }
                </td>
                <td className="text-nowrap">
                  {editingId === a.id
                    ? <>
                        <button
                          className="btn btn-sm btn-primary me-2"
                          onClick={() => saveEdit(a.id)}
                        >Save</button>
                        <button
                          className="btn btn-sm btn-secondary"
                          onClick={cancelEdit}
                        >Cancel</button>
                      </>
                    : <>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => startEdit(a)}
                        >Edit</button>
                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(a.id)}
                        >Delete</button>
                      </>
                  }
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>


      <Footer />
    </div>
  )
}
