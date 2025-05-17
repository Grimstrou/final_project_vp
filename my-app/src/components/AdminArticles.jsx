import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [error, setError] = useState('');

  const statusMap = {
    'InProgress': 'Under Review',
    'NotReviewed': 'Not Reviewed',
    'sent_for_revision': 'Sent for revision',
    'accepted_for_publication': 'Accepted for publication',
    'rejected': 'Rejected',
    'Revision': 'Sent for revision',
    'Accepted': 'Accepted for publication',
    'Rejected': 'Rejected',
    'published': 'Published',
  };

  useEffect(() => {
    fetchArticles();
  }, []);

  const fetchArticles = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_ENDPOINTS.ARTICLES);
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      setArticles([]);
      setError('Ошибка загрузки статей');
    }
    setLoading(false);
  };

  const handleDeleteArticle = async (id) => {
    setError('');
    try {
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/articles/${id}`, { method: 'DELETE' });
      if (res.ok) {
        await fetchArticles();
      } else {
        setError('Ошибка удаления статьи');
      }
    } catch (err) {
      setError('Ошибка удаления статьи');
    }
  };

  const handleViewArticle = (article) => {
    setSelectedArticle(article);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedArticle(null);
  };

  // Функция для вычисления итогового статуса статьи
  const getFinalStatus = (article) => {
    if (Array.isArray(article.reviews) && article.reviews.length > 0) {
      if (article.reviews.some(r => r.status === 'sent_for_revision' || r.status === 'Revision')) return statusMap['sent_for_revision'];
      if (article.reviews.some(r => r.status === 'rejected' || r.status === 'Rejected')) return statusMap['rejected'];
      if (article.reviews.some(r => r.status === 'accepted_for_publication' || r.status === 'Accepted')) return statusMap['accepted_for_publication'];
    }
    return statusMap[article.status] || article.status;
  };

  return (
    <>
      <div className="profile-section">
        <h1 className="profile-title">Admin Dashboard</h1>
        <div className="articles-header">
          <h2>Article Management</h2>
          <input type="text" className="search-bar" placeholder="Search articles..." />
        </div>
        {error && <div style={{color:'red', marginBottom:8}}>{error}</div>}
        {loading ? (
          <div>Loading...</div>
        ) : (
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
                <td>{typeof article.author === 'object' && article.author !== null
                  ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
                  : article.author}</td>
                <td>
                  <span className={`status-badge ${
                    getFinalStatus(article) === statusMap['accepted_for_publication']
                      ? 'status-active'
                      : getFinalStatus(article) === statusMap['sent_for_revision']
                        ? 'status-revisions'
                        : getFinalStatus(article) === statusMap['rejected']
                          ? 'status-inactive'
                          : 'status-inactive'
                  }`}>
                    {getFinalStatus(article)}
                  </span>
                </td>
                <td>{article.createdAt ? new Date(article.createdAt).toLocaleDateString() : ''}</td>
                <td>
                  <button className="btn btn-secondary" onClick={() => handleViewArticle(article)}>View</button>
                  <button className="btn btn-danger" style={{ marginLeft: '10px' }} onClick={() => handleDeleteArticle(article.id)}>
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        )}
      </div>
      {/* Модальное окно для просмотра статьи */}
      {showModal && selectedArticle && (
        <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.3)', zIndex: 1000 }}>
          <div className="modal-content" style={{ background: '#fff', maxWidth: 600, margin: '60px auto', padding: 32, borderRadius: 8, position: 'relative' }}>
            <h2>{selectedArticle.title}</h2>
            <p><b>Author:</b> {typeof selectedArticle.author === 'object' && selectedArticle.author !== null
              ? `${selectedArticle.author.firstName || ''} ${selectedArticle.author.lastName || ''}`.trim()
              : selectedArticle.author}</p>
            <p><b>Status:</b> {getFinalStatus(selectedArticle)}</p>
            <p><b>Created:</b> {selectedArticle.createdAt ? new Date(selectedArticle.createdAt).toLocaleString() : ''}</p>
            <p><b>Updated:</b> {selectedArticle.updatedAt ? new Date(selectedArticle.updatedAt).toLocaleString() : ''}</p>
            <p><b>Category:</b> {selectedArticle.category || '-'}</p>
            <p><b>File type:</b> {selectedArticle.fileType || '-'}</p>
            <p><b>Description:</b> {selectedArticle.description || '-'}</p>
            <p><b>Content:</b> {selectedArticle.content || '-'}</p>
            {Array.isArray(selectedArticle.reviews) && selectedArticle.reviews.length > 0 && (
              <div style={{marginTop: 12}}>
                <b>Reviews:</b>
                <ul style={{marginTop: 4}}>
                  {selectedArticle.reviews.map((rev, idx) => (
                    <li key={rev.id || idx}>
                      <b>Status:</b> {statusMap[rev.status] || rev.status}, <b>Reviewer:</b> {rev.reviewerId}, <b>Text:</b> {rev.content}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <button className="btn btn-secondary" onClick={closeModal} style={{marginTop: 16}}>Close</button>
          </div>
        </div>
      )}
    </>
  );
};

export default AdminArticles;