import React from 'react'
import { Link } from 'react-router-dom'

export default function Footer() {
  const footerStyle = {
    backgroundColor: '#FFFFFF',
    borderTop: '1px solid #dee2e6',
    padding: '1.5rem 0',
    position: 'fixed',
    bottom: 0,
    left: 0,
    width: '100%',
    zIndex: 999
  }


  return (
    <footer style={footerStyle}>
      <div className="container text-center">
        <p className="mb-2">© {new Date().getFullYear()} Forex Bureau. All rights reserved.</p>

      </div>
    </footer>
  )
}