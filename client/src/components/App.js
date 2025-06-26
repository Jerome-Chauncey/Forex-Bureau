import React from 'react';
import { BrowserRouter, Switch, Route, Link } from 'react-router-dom';
import HomePage from './HomePage';
import RatesPage from './RatesPage';
import ConvertPage from './ConvertPage';
import SignupPage from './SignupPage';
import LoginPage from './LoginPage';
import OrdersPage from './OrdersPage';
import AlertsPage from './AlertsPage';
import FAQPage from './FAQPage';
import ProfilePage from './ProfilePage';

export default function App() {
  return (
    <BrowserRouter>
      <nav className="bg-gray-100 p-4 space-x-4">
        <Link to="/" className="hover:underline">Home</Link>
        <Link to="/rates" className="hover:underline">Rates</Link>
        <Link to="/convert" className="hover:underline">Convert</Link>
        <Link to="/orders" className="hover:underline">Orders</Link>
        <Link to="/alerts" className="hover:underline">Alerts</Link>
        <Link to="/faq" className="hover:underline">FAQ</Link>
        <Link to="/profile" className="hover:underline">Profile</Link>
        <Link to="/signup" className="hover:underline">Signup</Link>
        <Link to="/login" className="hover:underline">Login</Link>
      </nav>
      <main className="p-6">
        <Switch>
          <Route path="/" element={<HomePage />} />
          <Route path="/rates" element={<RatesPage />} />
          <Route path="/convert" element={<ConvertPage />} />
          <Route path="/signup" element={<SignupPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/orders" element={<OrdersPage />} />
          <Route path="/alerts" element={<AlertsPage />} />
          <Route path="/faq" element={<FAQPage />} />
          <Route path="/profile" element={<ProfilePage />} />
          {/* fallback 404 */}
          <Route path="*" element={<div>Page not found</div>} />
        </Switch>
      </main>
    </BrowserRouter>
  );
}

