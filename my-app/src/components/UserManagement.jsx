import React, { useState } from 'react';

const UserManagement = ({ users, setUsers, onAddUser, onDeleteUser, onToggleUserStatus }) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', role: '' });

  const handleInputChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.firstName || !form.lastName || !form.email || !form.role) return;
    onAddUser({
      id: Date.now(),
      name: form.firstName + ' ' + form.lastName,
      email: form.email,
      role: form.role,
      status: 'active',
      avatar: '/images/fadding-cat.gif',
    });
    setForm({ firstName: '', lastName: '', email: '', role: '' });
    setShowAddForm(false);
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
                      src={user.avatar} 
                      alt={user.name}
                      style={{
                        width: '60px',
                        height: '60px',
                        objectFit: 'cover',
                        borderRadius: '50%'
                      }}
                    />
                    {user.name}
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
                    onClick={() => onToggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Block' : 'Activate'}
                  </button>
                  <button 
                    className="btn btn-danger" 
                    style={{ marginLeft: 8 }}
                    onClick={() => onDeleteUser(user.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
};

export default UserManagement;