import React, { useEffect, useState } from 'react';
import { API_ENDPOINTS } from '../config';

function ReviewModal({ open, onClose, review }) {
  if (!open || !review) return null;
  return (
    <div className="modal-overlay" style={{ position: 'fixed', top:0, left:0, right:0, bottom:0, background: 'rgba(0,0,0,0.3)', zIndex: 1000 }}>
      <div className="modal-content" style={{ background: '#fff', maxWidth: 600, margin: '60px auto', padding: 32, borderRadius: 8, position: 'relative' }}>
        <h2>Full Review</h2>
        <div><b>Article:</b> {review.article?.title}</div>
        <div><b>Authors:</b> {review.article?.author?.firstName} {review.article?.author?.lastName}</div>
        <div><b>Decision:</b> {review.status}</div>
        <div><b>Completed:</b> {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : new Date(review.createdAt).toLocaleDateString()}</div>
        <div style={{ margin: '16px 0' }}><b>Review Text:</b><br />{review.content}</div>
        <button className="btn btn-secondary" onClick={onClose}>Close</button>
      </div>
    </div>
  );
}

const CompletedReviews = ({ reviewerId, reviews = [] }) => {
  const [data, setData] = useState(reviews);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedReview, setSelectedReview] = useState(null);

  useEffect(() => {
    if (reviews.length === 0 && reviewerId) {
      fetchCompletedReviews();
    }
  }, [reviewerId]);

  const fetchCompletedReviews = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.REVIEWS}/reviewer/${reviewerId}`);
      const all = await res.json();
      // completed only
      const completed = all.filter(r => r.status === 'accepted_for_publication' || r.status === 'rejected');
      setData(completed);
    } catch (err) {
      setData([]);
    }
  };

  const handleView = (review) => {
    setSelectedReview(review);
    setModalOpen(true);
  };

  return (
    <>
      <div className="articles-section">
        <h2>Completed Reviews</h2>
        <div className="review-cards">
          {data.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card-title">{review.article?.title}</div>
              <div className="review-card-authors">Authors: {review.article?.author?.firstName} {review.article?.author?.lastName}</div>
              <div className="review-card-status">Decision: {review.status}</div>
              <div className="review-card-date">Completed: {review.updatedAt ? new Date(review.updatedAt).toLocaleDateString() : new Date(review.createdAt).toLocaleDateString()}</div>
              <div className="review-card-text" style={{ margin: '12px 0', color: '#333' }}><b>Review:</b> {review.content}</div>
              <button className="btn btn-secondary" onClick={() => handleView(review)}>View Full Review</button>
            </div>
          ))}
        </div>
      </div>
      <ReviewModal open={modalOpen} onClose={() => setModalOpen(false)} review={selectedReview} />
    </>
  );
};

export default CompletedReviews;