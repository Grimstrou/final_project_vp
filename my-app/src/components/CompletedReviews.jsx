import React from 'react';

const demoReviews = [
  {
    id: 1,
    title: "Artificial Intelligence in Education",
    authors: "David Wilson, Emma Brown",
    decision: "Accept with Minor Revisions",
    date: "Apr 20, 2025",
    text: "Great work, but needs minor changes."
  },
  {
    id: 2,
    title: "Blockchain Technologies in Supply Chain",
    authors: "Robert Chang, Lisa Martinez",
    decision: "Major Revisions Required",
    date: "Mar 15, 2025",
    text: "The methodology section is weak. Please revise."
  },
  {
    id: 3,
    title: "Neural Networks in Image Processing",
    authors: "James Anderson, Maria Garcia",
    decision: "Accept as is",
    date: "Feb 28, 2025",
    text: "Excellent paper. No changes needed."
  }
];

const CompletedReviews = ({ setActiveReviewerTab, reviews = [] }) => {
  const data = reviews.length > 0 ? reviews : demoReviews;
  return (
    <>
      <div className="articles-section">
        <h2>Completed Reviews</h2>
        <div className="review-cards">
          {data.map(review => (
            <div key={review.id} className="review-card">
              <div className="review-card-title">{review.title}</div>
              <div className="review-card-authors">Authors: {review.authors}</div>
              <div className={`review-card-status`}>Decision: {review.decision}</div>
              <div className="review-card-date">Completed: {review.date}</div>
              <div className="review-card-text" style={{ margin: '12px 0', color: '#333' }}><b>Review:</b> {review.text}</div>
              <button className="btn btn-secondary">View Full Review</button>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default CompletedReviews;