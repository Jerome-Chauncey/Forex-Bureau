import React, { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import Footer from '../components/Footer'
import CurrencyConverter from '../components/CurrencyConverter'
import API from '../api'

export default function HomePage() {
  const [faqs, setFaqs] = useState([])
  const [faqError, setFaqError] = useState(null)  

  useEffect(() => {
    API.get('/api/faqs')
    .then(res => setFaqs(res.data))
    .catch(() => setFaqError('Failed to load FAQs'))
  }, [])

  return (
    <div className="container py-5">
      {/* Hero */}
      <div className="row align-items-center mb-5">
        <div className="col-md-6">
          <h1 className="display-4">Forex Bureau</h1>
          <p className="lead">
            Get live exchange rates, place orders, set alerts and more. All in one place.
          </p>
          <CurrencyConverter />
 
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
      <div className="container pb-5">
        <h2 className="mb-4">Frequently Asked Questions</h2>
        {faqError && <div className="alert alert-danger">{faqError}</div>}
        {!faqError && faqs.length === 0 && <p>Loading FAQs…</p>}
        {faqs.length > 0 && (
          <div className="accordion" id="faqAccordion">
            {faqs.map((faq, idx) => (
              <div className="accordion-item" key={faq.id}>
                <h2 className="accordion-header" id={`heading${faq.id}`}>
                  <button
                    className={`accordion-button${idx ? ' collapsed' : ''}`}
                    type="button"
                    data-bs-toggle="collapse"
                    data-bs-target={`#collapse${faq.id}`}
                    aria-expanded={idx === 0 ? 'true' : 'false'}
                    aria-controls={`collapse${faq.id}`}
                  >
                    {faq.question}
                  </button>
                </h2>
                <div
                  id={`collapse${faq.id}`}
                  className={`accordion-collapse collapse${idx === 0 ? ' show' : ''}`}
                  aria-labelledby={`heading${faq.id}`}
                  data-bs-parent="#faqAccordion"
                >
                  <div className="accordion-body">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
      <Footer />
    
    </div>
    
      
  )
}