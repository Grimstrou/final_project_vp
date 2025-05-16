import React, { useState } from 'react';

const initialNewRequests = [
  {
    id: 1,
    title: 'Advanced Neural Networks in Image Processing',
    authors: 'Mark Williams, Lisa Chen',
    abstract: 'This paper presents novel approaches in neural network architectures for advanced image processing tasks...',
    requestDate: 'May 1, 2025',
    expectedTime: '4-5 hours',
    pages: 25
  }
];

//Роман Форма рецензии (модальное окно)
function ReviewFormModal({ open, onClose, article, onSubmit }) {
  const [text, setText] = useState('');
  const [status, setStatus] = useState('revision');
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
            <option value="revision">Отправлено на доработку</option>
            <option value="accepted">Принято к публикации</option>
            <option value="rejected">Отклонено</option>
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

const InProgressReviews = ({ setActiveReviewerTab, inProgress, setInProgress, onCompleteReview }) => {
  const [newRequests, setNewRequests] = useState(initialNewRequests);
  //Роман состояние для модального окна
  const [openModal, setOpenModal] = useState(false);
  const [currentArticle, setCurrentArticle] = useState(null);

  const handleAccept = (id) => {
    const accepted = newRequests.find(r => r.id === id);
    setInProgress([...inProgress, {
      id: accepted.id,
      title: accepted.title,
      authors: accepted.authors,
      dueDate: 'May 30, 2025',
      progress: 0,
      daysLeft: 20
    }]);
    setNewRequests(newRequests.filter(r => r.id !== id));
  };
  const handleDecline = (id) => {
    setNewRequests(newRequests.filter(r => r.id !== id));
  };
  //Роман открыть форму рецензии
  const handleContinueReview = (article) => {
    setCurrentArticle(article);
    setOpenModal(true);
  };
  //Роман обработка отправки рецензии
  const handleSubmitReview = (text, status) => {
    if (currentArticle) {
      onCompleteReview(currentArticle, text, status);
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
              <div className="review-card-title">{review.title}</div>
              <div className="review-card-authors">Authors: {review.authors}</div>
              <div className="progress-container" style={{ margin: '15px 0' }}>
                <div className="progress-bar" style={{ 
                  width: `${review.progress}%`,
                  height: '10px',
                  backgroundColor: '#222',
                  borderRadius: '5px'
                }}></div>
                <div className="progress-text">Progress: {review.progress}%</div>
              </div>
              <div className="review-card-date">Due: {review.dueDate} &nbsp;|&nbsp; <span style={{ color: '#888' }}>{review.daysLeft} days remaining</span></div>
              <button className="btn btn-primary" onClick={() => handleContinueReview(review)}>Continue Review</button>
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