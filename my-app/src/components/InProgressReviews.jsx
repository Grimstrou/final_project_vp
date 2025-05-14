import React from 'react';

const InProgressReviews = ({ setActiveReviewerTab }) => {
  const reviews = [
    {
      id: 1,
      title: "Advanced Neural Networks in Image Processing",
      authors: "Mark Williams, Lisa Chen",
      dueDate: "May 15, 2025",
      progress: 60
    },
    {
      id: 2,
      title: "Machine Learning Applications in Healthcare",
      authors: "Sarah Johnson, Michael Chen",
      dueDate: "May 20, 2025",
      progress: 30
    }
  ];

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
          className="tab active"
          onClick={() => setActiveReviewerTab('inProgress')}
        >
          In Progress Reviews
        </div>
        <div 
          className="tab"
          onClick={() => setActiveReviewerTab('completed')}
        >
          Completed Reviews
        </div>
      </div>
      
      <div className="articles-section">
        <h2>In Progress Reviews</h2>
        
        <div className="review-cards">
          {reviews.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card-title">{review.title}</div>
              <div className="review-card-authors">Authors: {review.authors}</div>
              
              <div className="progress-container" style={{ margin: '15px 0' }}>
                <div className="progress-bar" style={{ 
                  width: `${review.progress}%`,
                  height: '10px',
                  backgroundColor: '#3498db',
                  borderRadius: '5px'
                }}></div>
                <div className="progress-text">{review.progress}% complete</div>
              </div>
              
              <div className="review-card-date">Due: {review.dueDate}</div>
              <button className="btn btn-primary">Continue Review</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default InProgressReviews;