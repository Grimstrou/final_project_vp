import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const UserManagement = ({ onAdminDeleted }) => {
  const [users, setUsers] = useState([]);
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Загрузка пользователей из API
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/users`);
      const data = await res.json();
      const usersArr = Array.isArray(data) ? data : [];
      usersArr.sort((a, b) => a.id - b.id);
      setUsers(usersArr);
      // Сохраняем email текущего админа (если есть хотя бы один админ)
      const admin = (Array.isArray(data) ? data : []).find(u => u.role === 'Admin');
      if (admin) {
        localStorage.setItem('adminEmail', admin.email);
      }
    } catch (err) {
      setError('Ошибка загрузки пользователей');
    }
    setLoading(false);
  };

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Добавление пользователя через API
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.role) return;
    setError('');
    try {
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/users`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          role: form.role,
          avatar: '/images/dog-1.png',
          status: 'active'
        })
      });
      if (res.ok) {
        await fetchUsers();
        setForm({ firstName: '', lastName: '', email: '', role: '' });
        setShowAddForm(false);
      } else {
        setError('Ошибка добавления пользователя');
      }
    } catch (err) {
      setError('Ошибка добавления пользователя');
    }
  };

  // Удаление пользователя через API
  const handleDeleteUser = async (id) => {
    setError('');
    try {
      // Найти email удаляемого пользователя
      const userToDelete = users.find(u => u.id === id);
      const currentAdminEmail = localStorage.getItem('adminEmail');
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/users/${id}`, { method: 'DELETE' });
      if (res.ok) {
        if (userToDelete && userToDelete.email === currentAdminEmail && typeof onAdminDeleted === 'function') {
          onAdminDeleted();
        } else {
          await fetchUsers();
        }
      } else {
        setError('Ошибка удаления пользователя');
      }
    } catch (err) {
      setError('Ошибка удаления пользователя');
    }
  };

  // Смена статуса пользователя через API
  const handleToggleUserStatus = async (id, currentStatus) => {
    setError('');
    try {
      // Блокировка и разблокировка через PATCH /users/{id}/status
      const newStatus = currentStatus === 'active' ? 'inactive' : 'active';
      await fetch(`${API_ENDPOINTS.ADMIN}/users/${id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });
      await fetchUsers();
    } catch (err) {
      setError('Ошибка смены статуса пользователя');
    }
  };

  // Функция для обработки ошибки загрузки аватара
  const handleImgError = (e) => {
    e.target.src = '/images/dog-1.png';
  };

  return (
    <>
      <div className="profile-section">
        <h1 className="profile-title">Admin Dashboard</h1>
        <div className="articles-header">
          <h2>User Management</h2>
          <input type="text" className="search-bar" placeholder="Search users..." />
        </div>
        <button className="btn btn-primary" style={{ marginBottom: '20px' }} onClick={() => setShowAddForm(true)}>
          Add New User
        </button>
        {showAddForm && (
          <form onSubmit={handleSubmit} style={{ background: '#fafafa', padding: 20, borderRadius: 8, marginBottom: 20 }}>
            <h3>Add New User</h3>
            <div style={{ display: 'flex', gap: 16, marginBottom: 8 }}>
              <input name="firstName" value={form.firstName} onChange={handleInputChange} placeholder="First Name" style={{ flex: 1 }} />
              <input name="lastName" value={form.lastName} onChange={handleInputChange} placeholder="Last Name" style={{ flex: 1 }} />
            </div>
            <input name="email" value={form.email} onChange={handleInputChange} placeholder="Email" style={{ width: '100%', marginBottom: 8 }} />
            <select name="role" value={form.role} onChange={handleInputChange} style={{ width: '100%', marginBottom: 8 }}>
              <option value="">Select Role</option>
              <option value="Author">Author</option>
              <option value="Reviewer">Reviewer</option>
            </select>
            <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
              <button type="button" className="btn btn-secondary" onClick={() => setShowAddForm(false)}>Cancel</button>
              <button type="submit" className="btn btn-primary">Create User</button>
            </div>
          </form>
        )}
        {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
        <table className="admin-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Role</th>
              <th>Status</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map(user => (
              <tr key={user.id}>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <img 
                      src={user.avatar && user.avatar !== '' ? user.avatar : '/images/dog-1.png'} 
                      alt={user.name || ((user.firstName || '') + ' ' + (user.lastName || ''))}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                      onError={handleImgError}
                    />
                    {user.name || ((user.firstName || '') + ' ' + (user.lastName || ''))}
                  </div>
                </td>
                <td>{user.role}</td>
                <td>
                  <span className={`status-badge ${user.status === 'active' ? 'status-active' : 'status-inactive'}`}>
                    {user.status === 'active' ? 'Active' : 'Inactive'}
                  </span>
                </td>
                <td>
                  <button 
                    className={`btn ${user.status === 'active' ? 'btn-secondary' : 'btn-primary'}`}
                    onClick={() => handleToggleUserStatus(user.id, user.status)}
                  >
                    {user.status === 'active' ? 'Block' : 'Activate'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ marginLeft: 8 }}
                    onClick={() => handleDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
    </>
  );
};

export default UserManagement;