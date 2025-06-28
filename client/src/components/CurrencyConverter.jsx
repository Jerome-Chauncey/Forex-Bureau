import { useState, useEffect } from 'react'
import API from '../api'

export default function CurrencyConverter() {
  const [pairs, setPairs] = useState([])
  const [pairId, setPairId] = useState('')
  const [direction, setDirection] = useState('buy')
  const [amount, setAmount] = useState('')
  const [result, setResult] = useState('')
  const [error, setError] = useState(null)

  // Load available currency pairs
  useEffect(() => {
    API.get('/api/rates')
      .then(res => setPairs(res.data))
      .catch(() => setError('Failed to load rates.'))
  }, [])

  // Calculate conversion whenever inputs change
  useEffect(() => {
    if (!pairId || !amount) {
      setResult('')
      return
    }
    const p = pairs.find(x => x.id === Number(pairId))
    if (!p) return
    // Choose rate: buy uses ask (sell_rate), sell uses bid (buy_rate)
    const rate = direction === 'buy'
      ? Number(p.sell_rate)
      : Number(p.buy_rate)
    setResult((Number(amount) * rate).toFixed(6))
  }, [pairId, amount, direction, pairs])

  return (
    <div className="card mb-5 p-4" style={{ maxWidth: 600 }}>
      <h5 className="card-title">Currency Converter</h5>
      {error && <div className="alert alert-danger">{error}</div>}
      <div className="row g-3 align-items-end">
        <div className="col-md-4">
          <label className="form-label">Currency Pair</label>
          <select
            className="form-select"
            value={pairId}
            onChange={e => setPairId(e.target.value)}
          >
            <option value="">Select pair</option>
            {pairs.map(p => (
              <option key={p.id} value={p.id}>
                {p.base_currency}/{p.quote_currency}
              </option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <label className="form-label">Direction</label>
          <select
            className="form-select"
            value={direction}
            onChange={e => setDirection(e.target.value)}
          >
            <option value="buy">Buy {pairs.find(x => x.id === Number(pairId))?.base_currency || ''}</option>
            <option value="sell">Sell {pairs.find(x => x.id === Number(pairId))?.base_currency || ''}</option>
          </select>
        </div>
        <div className="col-md-2">
          <label className="form-label">Amount</label>
          <input
            type="number"
            className="form-control"
            placeholder="Enter amount"
            value={amount}
            onChange={e => setAmount(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <label className="form-label">Result</label>
          <input
            type="text"
            readOnly
            className="form-control"
            placeholder="Converted"
            value={result}
          />
        </div>
      </div>
      {pairId && (
        <p className="mt-3 text-muted">
          {direction === 'buy'
            ? "When you buy, you receive the base currency and pay the quote currency at the bureau's sell (ask) rate."
            : "When you sell, you give the base currency and receive the quote currency at the bureau's buy (bid) rate."}
        </p>
      )}
    </div>
  )
}
