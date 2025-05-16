import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

export default function UserRegistration() {
  const navigate = useNavigate();

  // Данные формы
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    role: ''
  });

  // Обработчик изменения полей
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Обработка отправки формы
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log('Registered:', formData);

    // Перенаправление на соответствующую страницу
    if (formData.role === 'author') {
      navigate('/author-profile');
    } else if (formData.role === 'reviewer') {
      navigate('/reviewer-profile');
    } else if (formData.role === 'admin') {
      navigate('/admin-dashboard');
    }
  };

  return (
    <div className="container">
      <h2>Register as a User</h2>
      <form onSubmit={handleSubmit}>
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
        <div className="button-group">
          <button type="submit" className="btn btn-primary">Register</button>
        </div>
      </form>
    </div>
  );
}