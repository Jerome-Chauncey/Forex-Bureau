import React, { useEffect, useState } from 'react'
import API from '../api'

export default function RatesPage() {
  const [rates, setRates] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [search, setSearch] = useState('')

  useEffect(() => {
    setLoading(true)
    API.get('/api/rates')
      .then(res => setRates(res.data))
      .catch(err => {
        console.error(err)
        setError('Failed to load rates.')
      })
      .finally(() => setLoading(false))
  }, [])

  const filtered = rates.filter(r => {
    const pair = `${r.base_currency}/${r.quote_currency}`
    return pair.toLowerCase().includes(search.toLowerCase())
  })

  if (loading) {
    return <div className="container py-5">Loading rates…</div>
  }
  if (error) {
    return <div className="container py-5 alert alert-danger">{error}</div>
  }

  return (
    <div className="container py-5">
      <h2 className="mb-4">Live Exchange Rates</h2>
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
            <th>Buy</th>
            <th>Sell</th>
            <th>Updated At</th>
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
    </div>
  )
}
