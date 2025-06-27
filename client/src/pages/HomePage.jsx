import React from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'

export default function HomePage() {
  return (
    <div className="container py-5">
      {/* Hero */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h1 className="display-4">Forex Bureau</h1>
          <p className="lead">
            Get live exchange rates, place orders, set alerts and more. All in one place.
          </p>
 
        </div>
        <div className="col-md-6 text-center">
          
          <img
            src="/hero.png"
            alt="Currency exchange"
            className="img-fluid"
          />
        </div>
      </div>

      {/* Features */}
      <div className="row text-center">
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Live Rates</h5>
              <p className="card-text">
                See up-to-the-minute exchange rates for all major currencies.
              </p>
              <Link to="/rates" className="stretched-link">Learn more</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Place Orders</h5>
              <p className="card-text">
                Buy or sell currency at competitive rates, instantly.
              </p>
              <Link to="/create-order" className="stretched-link">Get started</Link>
            </div>
          </div>
        </div>
        <div className="col-md-4 mb-4">
          <div className="card h-100 border-0 shadow-sm">
            <div className="card-body">
              <h5 className="card-title">Rate Alerts</h5>
              <p className="card-text">
                Set target rates and get notified when the market moves.
              </p>
              <Link to="/alerts" className="stretched-link">Set an alert</Link>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    
    </div>
    
      
  )
}