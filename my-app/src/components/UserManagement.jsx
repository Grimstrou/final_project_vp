import React, { useState } from 'react';

const UserManagement = ({ setActiveAdminTab }) => {
  const [users, setUsers] = useState([
    { 
      id: 1, 
      name: 'John Doe', 
      role: 'Editor', 
      status: 'active',
      avatar: '/images/fadding-cat.gif'
    },
    { 
      id: 2, 
      name: 'Jane Smith', 
      role: 'Reviewer', 
      status: 'active',
      avatar: '/images/sticker2.webp'
    },
    { 
      id: 3, 
      name: 'Mike Johnson', 
      role: 'Author', 
      status: 'inactive',
      avatar: '/images/sticker.webp'
    }
  ]);

  const toggleUserStatus = (id) => {
    setUsers(users.map(user => 
      user.id === id ? { 
        ...user, 
        status: user.status === 'active' ? 'inactive' : 'active' 
      } : user
    ));
  };

  return (
    <>
      <div className="tabs">
        <div 
          className="tab active"
          onClick={() => setActiveAdminTab('users')}
        >
          User Management
        </div>
        <div 
          className="tab"
          onClick={() => setActiveAdminTab('articles')}
        >
          Articles
        </div>
      </div>
      
      <div className="profile-section">
        <h1 className="profile-title">Admin Dashboard</h1>
        
        <div className="articles-header">
          <h2>User Management</h2>
          <input type="text" className="search-bar" placeholder="Search users..." />
        </div>
        
        <button className="btn btn-primary" style={{ marginBottom: '20px' }}>
          Add New User
        </button>
        
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
                        width: '120px',
                        height: '60px',
                        objectFit: 'cover'
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
                    onClick={() => toggleUserStatus(user.id)}
                  >
                    {user.status === 'active' ? 'Block' : 'Activate'}
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