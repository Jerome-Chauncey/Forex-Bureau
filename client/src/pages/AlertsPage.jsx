import React, { useEffect, useState, useContext } from 'react'
import API from '../api'
import { AuthContext } from '../contexts/AuthContext'

export default function AlertsPage() {
  const { logout } = useContext(AuthContext)
  const [alerts, setAlerts] = useState([])
  const [pairs, setPairs] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([API.get('/api/alerts'), API.get('/api/rates')])
      .then(([alertsRes, ratesRes]) => {
        setAlerts(alertsRes.data)
        const map = {}
        ratesRes.data.forEach(p => { map[p.id] = `${p.base_currency}/${p.quote_currency}` })
        setPairs(map)
      })
      .catch(err => {
        console.error(err)
        if (err.response?.status === 401) logout()
        else setError('Failed to load alerts.')
      })
      .finally(() => setLoading(false))
  }, [logout])

  if (loading) return <div className="container py-5">Loading alerts…</div>
  if (error) return <div className="container py-5 alert alert-danger">{error}</div>

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Alerts</h2>
      <table className="table table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th>
            <th>Pair</th>
            <th>Target Rate</th>
            <th>Active</th>
          </tr>
        </thead>
        <tbody>
          {alerts.map(a => (
            <tr key={a.id}>
              <td>#{a.id}</td>
              <td>{pairs[a.currency_pair_id] || a.currency_pair_id}</td>
              <td>{a.target_rate}</td>
              <td>{a.is_active ? 'Yes' : 'No'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}