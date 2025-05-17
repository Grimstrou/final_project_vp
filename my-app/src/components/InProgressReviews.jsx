import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';

//Роман Форма рецензии (модальное окно)
function ReviewFormModal({ open, onClose, article, onSubmit }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('sent_for_revision');
  if (!open) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.3)', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', maxWidth: 500, margin: '60px auto', padding: 32, borderRadius: 8, position: 'relative' }}>
        <h2>Write Review</h2>
        <div style={{ marginBottom: 12 }}><b>{article.title}</b></div>
        <div style={{ marginBottom: 12 }}>Authors: {article.authors}</div>
        <textarea
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Enter your review..."
          rows={6}
          style={{ width: '100%', marginBottom: 16 }}
        />
        <div style={{ marginBottom: 16 }}>
          <label>Status:&nbsp;</label>
          <select value={status} onChange={e => setStatus(e.target.value)}>
            <option value="sent_for_revision">Sent for revision</option>
            <option value="accepted_for_publication">Accepted for publication</option>
            <option value="rejected">Rejected</option>
          </select>
        </div>
        <div style={{ display: 'flex', gap: 12 }}>
          <button className="btn btn-primary" onClick={() => { onSubmit(text, status); }}>Submit Review</button>
          <button className="btn btn-secondary" onClick={onClose}>Cancel</button>
        </div>
      </div>
    </div>
  );
}

const InProgressReviews = ({ reviewerId, inProgress, setInProgress, onReviewsChange }) => {
  const [newRequests, setNewRequests] = useState([]);
  const [openModal, setOpenModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  useEffect(() => {
    fetchNewRequests();
  }, []);

  const fetchNewRequests = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.REVIEWS}/new?reviewerId=${reviewerId}`);
      const data = await res.json();
      setNewRequests(Array.isArray(data) ? data : []);
    } catch (err) {
      setNewRequests([]);
    }
  };

  // Принять запрос на рецензию
  const handleAccept = async (id) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.REVIEWS}/accept`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId, articleId: id })
      });
      if (res.ok) {
        await fetchNewRequests();
        onReviewsChange();
      }
    } catch (err) {}
  };
  // Отклонить запрос
  const handleDecline = async (id) => {
    try {
      const res = await fetch(`${API_ENDPOINTS.REVIEWS}/decline`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reviewerId, articleId: id })
      });
      if (res.ok) {
        await fetchNewRequests();
      }
    } catch (err) {}
  };
  // Открыть форму рецензии
  const handleContinueReview = (article) => {
    setCurrentArticle(article);
    setOpenModal(true);
  };
  // Отправить рецензию
  const handleSubmitReview = async (text, status) => {
    if (currentArticle) {
      try {
        const res = await fetch(`${API_ENDPOINTS.REVIEWS}/${currentArticle.id}/submit`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ reviewerId, text, status })
        });
        if (res.ok) {
          onReviewsChange();
        }
      } catch (err) {}
    }
    setOpenModal(false);
    setCurrentArticle(null);
  };

  return (
    <>
      <div className="articles-section">
        <h2>New Review Requests</h2>
        {newRequests.length === 0 ? (
          <div style={{ marginBottom: 32, color: '#888' }}>No new review requests.</div>
        ) : (
          newRequests.map(req => (
            <div key={req.id} className="review-card" style={{ marginBottom: 24 }}>
              <div className="review-card-title">{req.title}</div>
              <div className="review-card-authors">Authors: {req.authors}</div>
              <div className="review-card-abstract">Abstract: {req.abstract}</div>
              <div style={{ fontSize: 14, color: '#666', margin: '8px 0' }}>
                Expected time: {req.expectedTime} &nbsp;|&nbsp; {req.pages} pages
              </div>
              <div className="review-card-date">Request: {req.requestDate}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-secondary" onClick={() => handleDecline(req.id)}>Decline</button>
                <button className="btn btn-primary" onClick={() => handleAccept(req.id)}>Accept Review</button>
              </div>
            </div>
          ))
        )}
        <h2>In Progress Reviews</h2>
        {inProgress.length === 0 ? (
          <div style={{ color: '#888' }}>No reviews in progress.</div>
        ) : (
          inProgress.map(review => (
            <div key={review.id} className="review-card" style={{ marginBottom: 24 }}>
              <div className="review-card-title">{review.article?.title}</div>
              <div className="review-card-authors">Authors: {review.article?.author?.firstName} {review.article?.author?.lastName}</div>
              <div className="review-card-status">Status: {review.status}</div>
              <div className="review-card-date">Started: {new Date(review.createdAt).toLocaleDateString()}</div>
              <div style={{ display: 'flex', gap: 12, marginTop: 8 }}>
                <button className="btn btn-primary" onClick={() => handleContinueReview(review.article)}>
                  Continue Review
                </button>
              </div>
            </div>
          ))
        )}
      </div>
      {/* //Роман Модальное окно для формы рецензии */}
      <ReviewFormModal
        open={openModal}
        onClose={() => setOpenModal(false)}
        article={currentArticle || {}}
        onSubmit={handleSubmitReview}
      />
    </>
  );
};

export default InProgressReviews;