export default function ReviewerProfile({ activeReviewerTab, setActiveReviewerTab }) {
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
            <div className="stat-number">12</div>
            <div className="stat-label">Total Reviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">3</div>
            <div className="stat-label">In Progress</div>
          </div>
          <div className="stat-card">
            <div className="stat-number">9</div>
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
    </>
  );
}