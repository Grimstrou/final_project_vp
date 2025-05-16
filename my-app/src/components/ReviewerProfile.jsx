import React, { useState } from 'react';
import InProgressReviews from './InProgressReviews';
import CompletedReviews from './CompletedReviews';

const initialInProgress = [
  {
    id: 2,
    title: 'Machine Learning Applications in Healthcare',
    authors: 'Sarah Johnson, Michael Chen',
    dueDate: 'May 15, 2025',
    progress: 60,
    daysLeft: 12
  },
  {
    id: 3,
    title: 'Blockchain in Supply Chain Management',
    authors: 'Robert Lee, Anna Wang',
    dueDate: 'May 20, 2025',
    progress: 30,
    daysLeft: 17
  }
];

export default function ReviewerProfile({ activeReviewerTab, setActiveReviewerTab }) {
  const [inProgress, setInProgress] = useState(initialInProgress);
  const [completedReviews, setCompletedReviews] = useState([]);

  const handleCompleteReview = (article, text, status) => {
    setInProgress(inProgress.filter(r => r.id !== article.id));
    setCompletedReviews([
      ...completedReviews,
      {
        id: article.id,
        title: article.title,
        authors: article.authors,
        decision:
          status === 'revision' ? 'Отправлено на доработку' :
          status === 'accepted' ? 'Принято к публикации' :
          'Отклонено',
        date: new Date().toLocaleDateString(),
        text: text
      }
    ]);
  };

  let content;
  if (activeReviewerTab === 'profile') {
    content = (
      <div className="profile-section">
        <h1 className="profile-title">Reviewer Dashboard</h1>
        <div className="profile-grid">
          <div className="profile-field">
            <span className="profile-label">Full Name</span>
            <div className="profile-value">John Smith</div>
          </div>
          <div className="profile-field">
            <span className="profile-label">Email</span>
            <div className="profile-value">john.smith@university.edu</div>
          </div>
          <div className="profile-field">
            <span className="profile-label">Institution</span>
            <div className="profile-value">University of Science</div>
          </div>
          <div className="profile-field">
            <span className="profile-label">Field of Expertise</span>
            <div className="profile-value">Computer Science</div>
          </div>
        </div>
        <div className="reviewer-stats">
          <div className="stat-card">
            <div className="stat-number">{completedReviews.length + inProgress.length}</div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{inProgress.length}</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">{completedReviews.length}</div>
            <div className="stat-label">Completed</div>
          </div>
        </div>
        <div className="review-preferences">
          <h3>Review Preferences</h3>
          <div className="form-group">
            <input type="checkbox" id="available" defaultChecked />
            <label htmlFor="available">Available for new reviews</label>
          </div>
          <div className="form-group">
            <label className="form-label">Maximum concurrent reviews</label>
            <select className="form-select">
              <option>1</option>
              <option>2</option>
              <option selected>3</option>
              <option>4</option>
              <option>5</option>
            </select>
          </div>
        </div>
      </div>
    );
  } else if (activeReviewerTab === 'inProgress') {
    content = <InProgressReviews setActiveReviewerTab={setActiveReviewerTab} inProgress={inProgress} setInProgress={setInProgress} onCompleteReview={handleCompleteReview} />;
  } else if (activeReviewerTab === 'completed') {
    content = <CompletedReviews setActiveReviewerTab={setActiveReviewerTab} reviews={completedReviews} />;
  }

  return (
    <>
      <div className="tabs">
        <div 
          className={`tab ${activeReviewerTab === 'profile' ? 'active' : ''}`} 
          onClick={() => setActiveReviewerTab('profile')}
        >
          Profile
        </div>
        <div 
          className={`tab ${activeReviewerTab === 'inProgress' ? 'active' : ''}`} 
          onClick={() => setActiveReviewerTab('inProgress')}
        >
          In Progress Reviews
        </div>
        <div 
          className={`tab ${activeReviewerTab === 'completed' ? 'active' : ''}`} 
          onClick={() => setActiveReviewerTab('completed')}
        >
          Completed Reviews
        </div>
      </div>
      {content}
    </>
  );
}