import React from 'react'
import { Routes, Route, Navigate } from 'react-router-dom'
import Navbar from './components/NavBar'
import PrivateRoute from './components/PrivateRoute'

import HomePage from './pages/HomePage'
import LoginPage from './pages/LoginPage'
import SignupPage from './pages/SignupPage'
import RatesPage from './pages/RatesPage'
import CreateOrderPage from './pages/CreateOrderPage'
import OrdersPage from './pages/OrdersPage'
import AlertsPage from './pages/AlertsPage'
import ProfilePage from './pages/ProfilePage'

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />

        <Route path="/rates" element={<PrivateRoute><RatesPage /></PrivateRoute>} />
        <Route path="/create-order" element={<PrivateRoute><CreateOrderPage /></PrivateRoute>} />
        <Route path="/orders" element={<PrivateRoute><OrdersPage /></PrivateRoute>} />
        <Route path="/alerts" element={<PrivateRoute><AlertsPage /></PrivateRoute>} />
        <Route path="/profile" element={<PrivateRoute><ProfilePage /></PrivateRoute>} />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  )
}