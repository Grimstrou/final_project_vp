import React from 'react';

const AdminArticles = ({ articles, setArticles, onDeleteArticle }) => {
  return (
    <>
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
                  <button className="btn btn-danger" style={{ marginLeft: '10px' }} onClick={() => onDeleteArticle(article.id)}>
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

export default AdminArticles;