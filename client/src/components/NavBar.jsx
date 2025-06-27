import React, { useContext } from 'react'
import { NavLink } from 'react-router-dom'
import { AuthContext } from '../contexts/AuthContext'

export default function NavBar() {
  const { token, logout } = useContext(AuthContext)
  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-white shadow-sm mb-4">
      <div className="container">
        <NavLink className="navbar-brand" to="/">Forex Bureau</NavLink>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav">
          <span className="navbar-toggler-icon" />
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          {token ? (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item"><NavLink to="/rates" className="nav-link">Rates</NavLink></li>
              <li className="nav-item"><NavLink to="/create-order" className="nav-link">Create Order</NavLink></li>
              <li className="nav-item"><NavLink to="/orders" className="nav-link">Orders</NavLink></li>
              <li className="nav-item"><NavLink to="/alerts" className="nav-link">Alerts</NavLink></li>
              <li className="nav-item"><NavLink to="/profile" className="nav-link">Profile</NavLink></li>
              <li className="nav-item"><button onClick={logout} className="btn btn-link nav-link">Logout</button></li>
            </ul>
          ) : (
            <ul className="navbar-nav ms-auto">
              <li className="nav-item me-2"><NavLink to="/login" className="btn btn-outline-primary">Log In</NavLink></li>
              <li className="nav-item"><NavLink to="/signup" className="btn btn-primary">Sign Up</NavLink></li>
            </ul>
          )}
        </div>
      </div>
    </nav>
  );
}