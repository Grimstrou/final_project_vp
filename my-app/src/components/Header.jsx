import React from 'react';
import { Link } from 'react-router-dom';

export default function Header() {
  return (
    <header>
      <nav>
        <ul>
          <li><Link to="/register">Register</Link></li>
          <li><Link to="/author-profile">Author Profile</Link></li>
          <li><Link to="/reviewer-profile">Reviewer Profile</Link></li>
          <li><Link to="/admin-dashboard">Admin Dashboard</Link></li>
        </ul>
      </nav>
    </header>
  );
}