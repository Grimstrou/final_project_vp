import React from 'react';

const CompletedReviews = ({ setActiveReviewerTab }) => {
  const reviews = [
    {
      id: 1,
      title: "Artificial Intelligence in Education",
      authors: "David Wilson, Emma Brown",
      rating: 4,
      decision: "Accept with Minor Revisions",
      date: "Apr 20, 2025"
    },
    {
      id: 2,
      title: "Blockchain Technologies in Supply Chain",
      authors: "Robert Chang, Lisa Martinez",
      rating: 3,
      decision: "Major Revisions Required",
      date: "Mar 15, 2025"
    },
    {
      id: 3,
      title: "Neural Networks in Image Processing",
      authors: "James Anderson, Maria Garcia",
      rating: 5,
      decision: "Accept as is",
      date: "Feb 28, 2025"
    }
  ];

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating);
  };

  return (
    <>
      <div className="tabs">
        <div 
          className="tab"
          onClick={() => setActiveReviewerTab('profile')}
        >
          Profile
        </div>
        <div 
          className="tab"
          onClick={() => setActiveReviewerTab('inProgress')}
        >
          In Progress Reviews
        </div>
        <div 
          className="tab active"
          onClick={() => setActiveReviewerTab('completed')}
        >
          Completed Reviews
        </div>
      </div>
      
      <div className="articles-section">
        <h2>Completed Reviews</h2>
        
        <div className="review-cards">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card-title">{review.title}</div>
              <div className="review-card-authors">Authors: {review.authors}</div>
              <div className="review-card-rating" style={{ color: '#f39c12' }}>
                {renderStars(review.rating)}
              </div>
              <div className={`review-card-status ${
                review.decision.includes('Accept') ? 'status-accepted' : 'status-revisions'
              }`}>
                Decision: {review.decision}
              </div>
              <div className="review-card-date">Completed: {review.date}</div>
              <button className="btn btn-secondary">View Full Review</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompletedReviews;