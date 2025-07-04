import React, { useState, useEffect } from 'react'
import API from '../api'
import Footer from '../components/Footer'

export default function CreateOrderPage() {
  const [pairs, setPairs] = useState([])
  const [form, setForm] = useState({
    currency_pair_id: '',
    amount: '',
    direction: 'buy',
    delivery_method: 'branch_pickup'
  })
  const [error, setError] = useState(null)
  const [success, setSuccess] = useState(null)

  // Load available currency pairs
  useEffect(() => {
    API.get('/api/rates')
      .then(res => setPairs(res.data))
      .catch(() => setError('Failed to load currency pairs.'))
  }, [])

  function handleChange(e) {
    const { name, value } = e.target
    setForm(prev => ({ ...prev, [name]: value }))
  }

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setSuccess(null)
    try {
      await API.post('/api/orders', form)
      setSuccess('Order created successfully.')
      setForm({
        currency_pair_id: '',
        amount: '',
        direction: 'buy',
        delivery_method: 'branch_pickup'
      })
    } catch (e) {
      setError(e.response?.data?.message || 'Failed to create order.')
    }
  }

  const selected = pairs.find(p => p.id === Number(form.currency_pair_id))

  const rate = selected
  ? form.direction === 'buy'
    ? Number(selected.sell_rate)
    : Number(selected.buy_rate)
    : 0

  const total = form.amount && rate
    ? (Number(form.amount) * rate).toFixed(6)
    : ''

  return (
    <div className="container py-5">
      <h2 className="mb-4">Create Order</h2>
      {error && <div className="alert alert-danger">{error}</div>}
      {success && <div className="alert alert-success">{success}</div>}
      <form onSubmit={handleSubmit} style={{ maxWidth: 500 }}>
        <div className="mb-3">
          <label className="form-label">Currency Pair</label>
          <select
            name="currency_pair_id"
            className="form-select"
            value={form.currency_pair_id}
            onChange={handleChange}
            required
          >
            <option value="">Select currency pair</option>
            {pairs.map(p => (
              <option key={p.id} value={p.id}>
                {p.base_currency}/{p.quote_currency}
              </option>
            ))}
          </select>
        </div>
        <div className="mb-3">
          <label className="form-label">Amount</label>
          <input
            type="number"
            name="amount"
            className="form-control"
            placeholder="Enter amount"
            value={form.amount}
            onChange={handleChange}
            required
          />
        </div>
        <div className="mb-3">
          <label className="form-label">Direction</label>
          <select
            name="direction"
            className="form-select"
            value={form.direction}
            onChange={handleChange}
          >
            <option value="buy">Buy</option>
            <option value="sell">Sell</option>
          </select>
        </div>
        <div className="mb-4">
          <label className="form-label">Delivery Method</label>
          <select
            name="delivery_method"
            className="form-select"
            value={form.delivery_method}
            onChange={handleChange}
          >
            <option value="branch_pickup">Branch Pickup</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>
        {selected && form.amount && (
          <div className="mb-4 alert alert-secondary">
            <strong>
              You will {form.direction === 'buy' ? 'pay' : 'receive'}&nbsp;
              {total} {selected.quote_currency}
            </strong>
          </div>
        )}
        <button type="submit" className="btn btn-primary w-100">
          Create Order
        </button>
      </form>
      <Footer />
    </div>
  )
}
