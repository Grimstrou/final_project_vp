import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { API_ENDPOINTS } from '../config';

export default function UserRegistration() {
  const navigate = useNavigate();

  // Новый стейт: режим (login/register)
  const [mode, setMode] = useState('register');

  // Данные формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: '',
    avatar: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка отправки формы
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      if (mode === 'login') {
        // Авторизация
        const res = await fetch(`${API_ENDPOINTS.AUTH}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: formData.email,
            password: formData.password,
            role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1)
          })
        });
        if (res.ok) {
          const user = await res.json();
          if (user.role.toLowerCase() !== formData.role.toLowerCase()) {
            setError('Role does not match user role in database');
          } else {
            if (formData.role === 'author') {
              localStorage.setItem('authorId', user.id);
              navigate('/author-profile');
            } else if (formData.role === 'reviewer') {
              localStorage.setItem('reviewerId', user.id);
              navigate('/reviewer-profile');
            } else if (formData.role === 'admin') {
              localStorage.setItem('adminEmail', user.email);
              navigate('/admin-dashboard');
            }
          }
        } else {
          const errText = await res.text();
          setError(errText || 'Login failed: invalid credentials or role');
        }
      } else {
        // Регистрация
        const res = await fetch(`${API_ENDPOINTS.ADMIN}/users`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            firstName: formData.username.split(' ')[0] || formData.username,
            lastName: formData.username.split(' ')[1] || '',
            email: formData.email,
            passwordHash: formData.password,
            role: formData.role.charAt(0).toUpperCase() + formData.role.slice(1),
            status: 'active'
          })
        });
        if (res.ok) {
          const user = await res.json();
          if (formData.role === 'author') {
            localStorage.setItem('authorId', user.id);
            navigate('/author-profile');
          } else if (formData.role === 'reviewer') {
            localStorage.setItem('reviewerId', user.id);
            navigate('/reviewer-profile');
          } else if (formData.role === 'admin') {
            localStorage.setItem('adminEmail', user.email);
            navigate('/admin-dashboard');
          }
        } else {
          setError('Registration failed: user may already exist');
        }
      }
    } catch (err) {
      setError('Something went wrong');
    }
    setLoading(false);
  };

  return (
    <div className="container">
      <h2>{mode === 'login' ? 'Login' : 'Register'} as a User</h2>
      <div style={{ marginBottom: 16 }}>
        <button
          type="button"
          className={mode === 'register' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setMode('register')}
          style={{ marginRight: 8 }}
        >
          Register
        </button>
        <button
          type="button"
          className={mode === 'login' ? 'btn btn-primary' : 'btn btn-secondary'}
          onClick={() => setMode('login')}
        >
          Login
        </button>
      </div>
      <form onSubmit={handleSubmit}>
        {mode === 'register' && (
          <div className="form-group">
            <label className="form-label">Username</label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleChange}
              className="form-input"
              placeholder="Enter your username"
              required
            />
          </div>
        )}
        <div className="form-group">
          <label className="form-label">Email</label>
          <input
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your email"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Password</label>
          <input
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
            className="form-input"
            placeholder="Enter your password"
            required
          />
        </div>
        <div className="form-group">
          <label className="form-label">Role</label>
          <select
            name="role"
            value={formData.role}
            onChange={handleChange}
            className="form-select"
            required
          >
            <option value="">Select a role</option>
            <option value="author">Author</option>
            <option value="reviewer">Reviewer</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        {/* Можно добавить выбор аватара позже */}
        <div className="button-group">
          <button type="submit" className="btn btn-primary" disabled={loading}>{mode === 'login' ? 'Login' : 'Register'}</button>
        </div>
        {error && <div style={{color:'red', marginTop:8}}>{error}</div>}
      </form>
    </div>
  );
}