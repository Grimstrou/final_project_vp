import React from 'react';

const AdminArticles = ({ setActiveAdminTab }) => {
  const articles = [
    {
      id: 1,
      title: "Machine Learning Advances",
      author: "Sarah Johnson",
      status: "published",
      date: "May 4, 2025"
    },
    {
      id: 2,
      title: "Blockchain in Healthcare",
      author: "Michael Chen",
      status: "pending",
      date: "May 3, 2025"
    },
    {
      id: 3,
      title: "Sustainable Energy Solutions",
      author: "Emma Watson",
      status: "rejected",
      date: "May 2, 2025"
    }
  ];

  return (
    <>
      <div className="tabs">
        <div 
          className="tab"
          onClick={() => setActiveAdminTab('users')}
        >
          User Management
        </div>
        <div 
          className="tab active"
          onClick={() => setActiveAdminTab('articles')}
        >
          Articles
        </div>
      </div>
      
      <div className="profile-section">
        <h1 className="profile-title">Admin Dashboard</h1>
        
        <div className="articles-header">
          <h2>Article Management</h2>
          <input type="text" className="search-bar" placeholder="Search articles..." />
        </div>
        
        <table className="admin-table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Status</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {articles.map(article => (
              <tr key={article.id}>
                <td>{article.title}</td>
                <td>{article.author}</td>
                <td>
                  <span className={`status-badge ${
                    article.status === 'published' ? 'status-active' : 
                    article.status === 'pending' ? 'status-revisions' : 'status-inactive'
                  }`}>
                    {article.status}
                  </span>
                </td>
                <td>{article.date}</td>
                <td>
                  <button className="btn btn-secondary">View</button>
                  <button className="btn btn-primary" style={{ marginLeft: '10px' }}>
                    {article.status === 'pending' ? 'Review' : 'Edit'}
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

export default AdminArticles;