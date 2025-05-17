import React, { useState, useEffect } from 'react';
import InProgressReviews from './InProgressReviews';
import CompletedReviews from './CompletedReviews';
import { API_ENDPOINTS } from '../config';
import { useNavigate } from 'react-router-dom';

export default function ReviewerProfile({ activeReviewerTab, setActiveReviewerTab }) {
  const [inProgress, setInProgress] = useState([]);
  const [completedReviews, setCompletedReviews] = useState([]);
  const [reviewerId, setReviewerId] = useState(null);
  const [profile, setProfile] = useState(null);
  const [tab, setTab] = useState(() => localStorage.getItem('reviewerTab') || 'profile');
  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('reviewerId');
    setReviewerId(id);
  }, []);

  useEffect(() => {
    if (reviewerId) {
      fetchReviews();
      fetchProfile();
    }
  }, [reviewerId]);

  useEffect(() => {
    localStorage.setItem('reviewerTab', tab);
    if (typeof setActiveReviewerTab === 'function') setActiveReviewerTab(tab);
  }, [tab]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/users/${reviewerId}`);
      const data = await res.json();
      setProfile({
        ...data,
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' ')
      });
    } catch (err) {
      setProfile(null);
    }
  };

  const fetchReviews = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.REVIEWS}/reviewer/${reviewerId}`);
      const data = await res.json();
      
      // Разделяем отзывы на in progress и completed по новым статусам
      const inProgressReviews = data.filter(review => 
        review.status === "InProgress" || review.status === "sent_for_revision"
      );
      const completedReviews = data.filter(review => 
        review.status === "accepted_for_publication" || review.status === "rejected"
      );

      setInProgress(inProgressReviews);
      setCompletedReviews(completedReviews);
    } catch (err) {
      setInProgress([]);
      setCompletedReviews([]);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('reviewerId');
    localStorage.removeItem('reviewerTab');
    navigate('/register');
  };

  let content;
  if (tab === 'profile') {
    content = (
      <div className="profile-section" style={{ position: 'relative' }}>
        <h1 className="profile-title">Reviewer Dashboard</h1>
        <div className="profile-grid">
          <div className="profile-field">
            <span className="profile-label">Full Name</span>
            <div className="profile-value">{profile?.fullName}</div>
          </div>
          <div className="profile-field">
            <span className="profile-label">Email</span>
            <div className="profile-value">{profile?.email}</div>
          </div>
          <div className="profile-field">
            <span className="profile-label">Institution</span>
            <div className="profile-value">{profile?.institution || ''}</div>
          </div>
          <div className="profile-field">
            <span className="profile-label">Field of Expertise</span>
            <div className="profile-value">{profile?.specialization || ''}</div>
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
        <button 
          onClick={handleLogout} 
          style={{ position: 'absolute', right: 32, top: 32, padding: '10px 24px', background: '#f5f5f5', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}
        >
          Logout
        </button>
      </div>
    );
  } else if (tab === 'inProgress') {
    content = <InProgressReviews reviewerId={reviewerId} inProgress={inProgress} setInProgress={setInProgress} onReviewsChange={fetchReviews} />;
  } else if (tab === 'completed') {
    content = <CompletedReviews reviewerId={reviewerId} reviews={completedReviews} />;
  }

  return (
    <>
      <div className="tabs">
        <div 
          className={`tab ${tab === 'profile' ? 'active' : ''}`} 
          onClick={() => setTab('profile')}
        >
          Profile
        </div>
        <div 
          className={`tab ${tab === 'inProgress' ? 'active' : ''}`} 
          onClick={() => setTab('inProgress')}
        >
          In Progress Reviews
        </div>
        <div 
          className={`tab ${tab === 'completed' ? 'active' : ''}`} 
          onClick={() => setTab('completed')}
        >
          Completed Reviews
        </div>
      </div>
      {content}
    </>
  );
}