import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

const AuthorArticles = ({ authorId = 1 }) => {
  const [articles, setArticles] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    fetchAuthorArticles();
  }, []);

  const fetchAuthorArticles = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${API_ENDPOINTS.ARTICLES}?authorId=${authorId}`);
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      setArticles([]);
    }
    setLoading(false);
  };

  const statusMap = {
    'InProgress': 'Under Review',
    'NotReviewed': 'Not Reviewed',
    'sent_for_revision': 'Sent for revision',
    'accepted_for_publication': 'Accepted for publication',
    'rejected': 'Rejected',
    'Revision': 'Sent for revision',
    'Accepted': 'Accepted for publication',
    'Rejected': 'Rejected',
  };

  return (
    <div>
      <h2>Мои статьи</h2>
      {loading ? (
        <div>Загрузка...</div>
      ) : (
        <ul>
          {articles.map(article => (
            <li key={article.id} style={{marginBottom: 16}}>
              <b>{article.title}</b> — <span>{statusMap[article.status] || article.status}</span>
              {article.author && (
                <span style={{marginLeft: 8, color: '#888'}}>
                  by {typeof article.author === 'object' && article.author !== null
                    ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
                    : article.author}
                </span>
              )}
              {Array.isArray(article.reviews) && article.reviews.length > 0 && (
                <div style={{marginTop: 4, marginLeft: 16, fontSize: 14}}>
                  Reviews:&nbsp;
                  {article.reviews.map((rev, idx) => (
                    <span key={rev.id || idx} style={{marginRight: 8}}>
                      [{statusMap[rev.status] || rev.status}]
                    </span>
                  ))}
                </div>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default AuthorArticles;
