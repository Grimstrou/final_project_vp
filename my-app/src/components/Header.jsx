import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

export default function Header() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('authorId');
    localStorage.removeItem('reviewerId');
    localStorage.removeItem('authorTab');
    localStorage.removeItem('reviewerTab');
    navigate('/register');
  };

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