import React, { useState } from 'react';

export default function AuthorProfile() {
  // Активная вкладка
  const [activeTab, setActiveTab] = useState('profile');

  // Редактирование профиля
  const [isEditing, setIsEditing] = useState(false);

  // Данные профиля
  const [profile, setProfile] = useState({
    fullName: "John Doe",
    email: "john@example.com",
    specialization: "Technology",
    location: "New York, USA",
    bio: "Technology writer with 5+ years of experience in software development and AI."
  });

  // Форма отправки статьи
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    confirm: false,
    file: null // Для загрузки файла
  });

  // Статьи
  const articles = [
    {
      title: "Machine Learning Advances in 2025",
      author: "Sarah Johnson",
      date: "May 4, 2025",
      category: "Technology",
      status: "Published"
    },
    {
      title: "Blockchain in Healthcare",
      author: "Michael Chen",
      date: "May 3, 2025",
      category: "Healthcare",
      status: "Published"
    },
    {
      title: "Sustainable Energy Solutions",
      author: "Emma Watson",
      date: "May 2, 2025",
      category: "Environment",
      status: "Published"
    }
  ];

  // Фильтрация статей
  const statuses = ['All Articles', 'Pending Review', 'In Progress', 'Reviewed'];
  const [filterStatus, setFilterStatus] = useState('All Articles');
  const [searchTerm, setSearchTerm] = useState('');

  // Обработчики событий
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({ ...prev, file }));
    }
  };

  const handleSaveProfile = () => {
    setIsEditing(false);
  };

  const handleCancelEdit = () => {
    setProfile({
      fullName: "John Doe",
      email: "john@example.com",
      specialization: "Technology",
      location: "New York, USA",
      bio: "Technology writer with 5+ years of experience in software development and AI."
    });
    setIsEditing(false);
  };

  const handleSubmitArticle = (e) => {
    e.preventDefault();
    console.log('Submitted:', formData);
    alert('Article submitted successfully!');
  };

  // Фильтр статей
  const filteredArticles = articles.filter(article =>
    (filterStatus === 'All Articles' || article.status === filterStatus) &&
    article.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="container">
      {/* Вкладки */}
      <div className="tabs">
        <div 
          className={`tab ${activeTab === 'profile' ? 'active' : ''}`} 
          onClick={() => setActiveTab('profile')}
        >
          Profile
        </div>
        <div 
          className={`tab ${activeTab === 'articles' ? 'active' : ''}`} 
          onClick={() => setActiveTab('articles')}
        >
          My Articles
        </div>
        <div 
          className={`tab ${activeTab === 'submit' ? 'active' : ''}`} 
          onClick={() => setActiveTab('submit')}
        >
          Submit Article
        </div>
        <div 
          className={`tab ${activeTab === 'review' ? 'active' : ''}`} 
          onClick={() => setActiveTab('review')}
        >
          Review Articles
        </div>
      </div>

      {/* Вкладка: Профиль */}
      {activeTab === 'profile' && (
        <section className="profile-section">
          <div className="profile-header">
            <div>
              <img src="/images/2.gif" alt="User avatar" style={{ width: 60 }} />
              <h1 className="profile-title">{isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="form-input"
                  style={{ width: '100%', maxWidth: '300px' }}
                />
              ) : (
                profile.fullName
              )}</h1>
              <div className="profile-subtitle">Technology Writer</div>
            </div>
            {!isEditing && (
              <button className="btn btn-secondary" onClick={() => setIsEditing(true)}>Edit Profile</button>
            )}
          </div>

          {isEditing ? (
            <div>
              <div className="form-group">
                <label className="form-label">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={profile.fullName}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile.email}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={profile.specialization}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile.location}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={profile.bio}
                  onChange={handleProfileChange}
                  className="form-textarea"
                />
              </div>
              <div className="button-group">
                <button className="btn btn-primary" onClick={handleSaveProfile}>Save Changes</button>
                <button className="btn btn-secondary" onClick={handleCancelEdit}>Cancel</button>
              </div>
            </div>
          ) : (
            <div>
              <div className="profile-grid">
                <div className="profile-field">
                  <span className="profile-label">Full Name</span>
                  <div className="profile-value">{profile.fullName}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Email</span>
                  <div className="profile-value">{profile.email}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Specialization</span>
                  <div className="profile-value">{profile.specialization}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Location</span>
                  <div className="profile-value">{profile.location}</div>
                </div>
              </div>
              <div className="bio-section">
                <span className="profile-label">Bio</span>
                <div className="profile-value">{profile.bio}</div>
              </div>
            </div>
          )}
        </section>
      )}

      {/* Вкладка: Мои статьи */}
      {activeTab === 'articles' && (
        <section className="articles-section">
          <h2 className="profile-title">My Articles</h2>

          {articles.length > 0 ? (
            <ul className="article-list">
              {articles.map((article, index) => (
                <li key={index} className="article-item">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">
                    <span>by {article.author}</span>
                    <span>Submitted: {article.date}</span>
                    <span>{article.category}</span>
                  </div>
                  <div className="article-status">
                    <span className={`status-badge ${article.status.replace(' ', '')}`}>
                      {article.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No articles found.</p>
          )}
        </section>
      )}

      {/* Вкладка: Отправить статью */}
      {activeTab === 'submit' && (
        <section className="form-section">
          <h2 className="form-title">Submit New Article</h2>
          <form onSubmit={handleSubmitArticle}>
            <div className="form-group">
              <label className="form-label">Title</label>
              <input
                type="text"
                name="title"
                value={formData.title}
                onChange={handleFormChange}
                className="form-input"
                placeholder="Enter article title"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Category</label>
              <select
                name="category"
                value={formData.category}
                onChange={handleFormChange}
                className="form-select"
              >
                <option value="">Select a category</option>
                <option value="Technology">Technology</option>
                <option value="Healthcare">Healthcare</option>
                <option value="Environment">Environment</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Content</label>
              <textarea
                name="content"
                value={formData.content}
                onChange={handleFormChange}
                className="form-textarea"
                placeholder="Write your article here..."
              />
            </div>
            <div className="form-group">
              <label className="form-label">Tags</label>
              <input
                type="text"
                name="tags"
                value={formData.tags}
                onChange={handleFormChange}
                className="form-input"
                placeholder="Enter tags separated by commas"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Upload File</label>
              <input
                type="file"
                accept=".pdf,.docx"
                onChange={handleFileChange}
                className="form-input"
              />
            </div>
            <div className="checkbox-group">
              <input
                type="checkbox"
                id="confirm"
                name="confirm"
                checked={formData.confirm}
                onChange={handleFormChange}
              />
              <label htmlFor="confirm">
                I confirm that this article is my original work and agree to the submission guidelines.
              </label>
            </div>
            <div className="button-group">
              <button type="submit" className="btn btn-primary">Submit for Review</button>
              <button type="button" className="btn btn-secondary">Save Draft</button>
            </div>
          </form>
        </section>
      )}

      {/* Вкладка: Статьи на рецензии */}
      {activeTab === 'review' && (
        <section className="articles-section">
          <div className="articles-header">
            <h2 className="profile-title">Articles Under Review</h2>
            <div className="filter-search">
              <select
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
                className="form-select"
              >
                {statuses.map(status => (
                  <option key={status} value={status}>{status}</option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Search by title..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="search-bar"
              />
            </div>
          </div>

          {filteredArticles.length > 0 ? (
            <ul className="article-list">
              {filteredArticles.map((article, index) => (
                <li key={index} className="article-item">
                  <div className="article-title">{article.title}</div>
                  <div className="article-meta">
                    <span>by {article.author}</span>
                    <span>Submitted: {article.date}</span>
                    <span>{article.category}</span>
                  </div>
                  <div className="article-status">
                    <span className={`status-badge ${article.status.replace(' ', '')}`}>
                      {article.status}
                    </span>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <p>No articles found.</p>
          )}
        </section>
      )}
    </div>
  );
}