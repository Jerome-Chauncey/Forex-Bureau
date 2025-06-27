import React, { useEffect, useState } from 'react'
import API from '../api'
import Footer from '../components/Footer'

export default function RatesPage() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  // Fetch rates from backend
  const fetchRates = async () => {
    setLoading(true)
    setError(null)
    try {
      const res = await API.get('/api/rates')
      setRates(res.data)
    } catch (err) {
      console.error(err)
      setError('Failed to load rates.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchRates()
    const interval = setInterval(fetchRates, 30000)
    return () => clearInterval(interval)
  }, [])

  if (loading) return <div className="container py-5">Loading rates…</div>
  if (error) return <div className="container py-5 alert alert-danger">{error}</div>

  const filtered = rates.filter(r =>
    `${r.base_currency}/${r.quote_currency}`.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="container py-5">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Live Exchange Rates</h2>
        <button className="btn btn-outline-secondary" onClick={fetchRates} disabled={loading}>
          Refresh
        </button>
      </div>
      <input
        type="text"
        className="form-control mb-4"
        placeholder="Search currency pairs"
        value={search}
        onChange={e => setSearch(e.target.value)}
      />
      <table className="table table-hover">
        <thead className="table-light">
          <tr>
            <th>Pair</th>
            <th>Buy Rate</th>
            <th>Sell Rate</th>
            <th>Last Updated</th>
          </tr>
        </thead>
        <tbody>
          {filtered.map(r => (
            <tr key={r.id}>
              <td>{r.base_currency}/{r.quote_currency}</td>
              <td>{r.buy_rate}</td>
              <td>{r.sell_rate}</td>
              <td>{new Date(r.updated_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  )
}