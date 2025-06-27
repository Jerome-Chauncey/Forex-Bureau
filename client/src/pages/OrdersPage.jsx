import React, { useEffect, useState, useContext } from 'react'
import API from '../api'
import { AuthContext } from '../contexts/AuthContext'
import Footer from '../components/Footer'   

export default function OrdersPage() {
  const { logout } = useContext(AuthContext)
  const [orders, setOrders] = useState([])
  const [pairs, setPairs] = useState({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    Promise.all([API.get('/api/orders'), API.get('/api/rates')])
      .then(([ordersRes, ratesRes]) => {
        setOrders(ordersRes.data)
        const map = {}
        ratesRes.data.forEach(p => { map[p.id] = `${p.base_currency}/${p.quote_currency}` })
        setPairs(map)
      })
      .catch(err => {
        console.error(err)
        if (err.response?.status === 401) logout()
        else setError('Failed to load orders.')
      })
      .finally(() => setLoading(false))
  }, [logout])

  if (loading) return <div className="container py-5">Loading orders…</div>
  if (error) return <div className="container py-5 alert alert-danger">{error}</div>

  return (
    <div className="container py-5">
      <h2 className="mb-4">My Orders</h2>
      <table className="table table-striped">
        <thead className="table-light">
          <tr>
            <th>ID</th><th>Pair</th><th>Amount</th><th>Direction</th><th>Delivery</th>
            <th>Rate</th><th>Status</th><th>Created At</th>
          </tr>
        </thead>
        <tbody>
          {orders.map(o => (
            <tr key={o.id}>
              <td>#{o.id}</td>
              <td>{pairs[o.currency_pair_id] || o.currency_pair_id}</td>
              <td>{o.amount}</td>
              <td className="text-capitalize">{o.direction}</td>
              <td className="text-capitalize">{o.delivery_method.replace('_',' ')}</td>
              <td>{o.rate_executed}</td>
              <td className="text-capitalize">{o.status}</td>
              <td>{new Date(o.created_at).toLocaleString()}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <Footer />
    </div>
  )
}