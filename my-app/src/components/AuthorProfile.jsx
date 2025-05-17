import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import SubmitArticle from './SubmitArticle';
import { useNavigate } from 'react-router-dom';

export default function AuthorProfile() {
  // Активная вкладка
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('authorTab') || 'profile');

  // Редактирование профиля
  const [isEditing, setIsEditing] = useState(false);

  // Данные профиля
  const [profile, setProfile] = useState(null);

  // Статьи
  const [articles, setArticles] = useState([]);

  // Фильтрация статей
  const statuses = ['All Articles', 'Pending Review', 'In Progress', 'Reviewed'];
  const [filterStatus, setFilterStatus] = useState('All Articles');
  const [searchTerm, setSearchTerm] = useState('');
  const [authorId, setAuthorId] = useState(null);

  const navigate = useNavigate();

  useEffect(() => {
    const id = localStorage.getItem('authorId');
    setAuthorId(id);
  }, []);

  useEffect(() => {
    if (authorId) {
      fetchProfile();
      fetchArticles();
    }
  }, [authorId]);

  useEffect(() => {
    localStorage.setItem('authorTab', activeTab);
  }, [activeTab]);

  const fetchProfile = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.ADMIN}/users/${authorId}`);
      const data = await res.json();
      setProfile({
        ...data,
        fullName: [data.firstName, data.lastName].filter(Boolean).join(' ')
      });
    } catch (err) {
      setProfile(null);
    }
  };

  const fetchArticles = async () => {
    try {
      const res = await fetch(`${API_ENDPOINTS.ARTICLES}?authorId=${authorId}`);
      const data = await res.json();
      setArticles(Array.isArray(data) ? data : []);
    } catch (err) {
      setArticles([]);
    }
  };

  // Форма отправки статьи
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    content: '',
    tags: '',
    confirm: false,
    file: null // Для загрузки файла
  });

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

  const handleSaveProfile = async () => {
    if (!profile?.id) return;
    try {
      const [firstName, ...lastNameArr] = (profile.fullName || '').split(' ');
      const updatedProfile = {
        ...profile,
        firstName: firstName || '',
        lastName: lastNameArr.join(' ') || ''
      };
      await fetch(`${API_ENDPOINTS.ADMIN}/users/${profile.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updatedProfile)
      });
      setIsEditing(false);
      fetchProfile();
    } catch (err) {
      setIsEditing(false);
    }
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

  const handleLogout = () => {
    localStorage.removeItem('authorId');
    localStorage.removeItem('authorTab');
    navigate('/register');
  };

  // Маппинг статусов для красивого вывода
  const statusMap = {
    'InProgress': 'Under Review',
    'NotReviewed': 'Not Reviewed',
    'sent_for_revision': 'Sent for revision',
    'accepted_for_publication': 'Accepted for publication',
    'rejected': 'Rejected',
    'Revision': 'Sent for revision',
    'Accepted': 'Accepted for publication',
    'Rejected': 'Rejected',
  };

  // Фильтр статей для вкладки Review Articles: только если есть хотя бы одна завершённая рецензия
  const reviewFinalStatuses = ['sent_for_revision', 'accepted_for_publication', 'rejected', 'Revision', 'Accepted', 'Rejected'];
  const hasFinalReview = (article) => Array.isArray(article.reviews) && article.reviews.some(r => reviewFinalStatuses.includes(r.status));
  const getReviewStatus = (article) => {
    if (!Array.isArray(article.reviews) || article.reviews.length === 0) return statusMap[article.status] || article.status;
    // Приоритет: sent_for_revision > rejected > accepted
    if (article.reviews.some(r => r.status === 'sent_for_revision' || r.status === 'Revision')) return statusMap['sent_for_revision'];
    if (article.reviews.some(r => r.status === 'rejected' || r.status === 'Rejected')) return statusMap['rejected'];
    if (article.reviews.some(r => r.status === 'accepted_for_publication' || r.status === 'Accepted')) return statusMap['accepted_for_publication'];
    return statusMap[article.status] || article.status;
  };
  const filteredArticles = articles.filter(article =>
    (activeTab !== 'review' || hasFinalReview(article)) &&
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
        <section className="profile-section" style={{ position: 'relative' }}>
          <div className="profile-header">
            <div>
              <img src="/images/dog-1.png" alt="User avatar" style={{ width: 60, height: 60, borderRadius: '50%', objectFit: 'cover', marginBottom: 8 }} />
              <h1 className="profile-title">{isEditing ? (
                <input
                  type="text"
                  name="fullName"
                  value={profile?.fullName}
                  onChange={handleProfileChange}
                  className="form-input"
                  style={{ width: '100%', maxWidth: '300px' }}
                />
              ) : (
                profile?.fullName
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
                  value={profile?.fullName}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Email</label>
                <input
                  type="email"
                  name="email"
                  value={profile?.email}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Specialization</label>
                <input
                  type="text"
                  name="specialization"
                  value={profile?.specialization}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Location</label>
                <input
                  type="text"
                  name="location"
                  value={profile?.location}
                  onChange={handleProfileChange}
                  className="form-input"
                />
              </div>
              <div className="form-group">
                <label className="form-label">Bio</label>
                <textarea
                  name="bio"
                  value={profile?.bio}
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
                  <div className="profile-value">{profile?.fullName}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Email</span>
                  <div className="profile-value">{profile?.email}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Specialization</span>
                  <div className="profile-value">{profile?.specialization}</div>
                </div>
                <div className="profile-field">
                  <span className="profile-label">Location</span>
                  <div className="profile-value">{profile?.location}</div>
                </div>
              </div>
              <div className="bio-section">
                <span className="profile-label">Bio</span>
                <div className="profile-value">{profile?.bio}</div>
              </div>
            </div>
          )}
          <button 
            onClick={handleLogout} 
            style={{ position: 'absolute', right: 32, bottom: 32, padding: '10px 24px', background: '#f5f5f5', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500 }}
          >
            Logout
          </button>
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
                    <span>by {typeof article.author === 'object' && article.author !== null
                      ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
                      : article.author}
                    </span>
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
          <SubmitArticle authorId={profile?.id} onArticleAdded={fetchArticles} />
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
                    <span>by {typeof article.author === 'object' && article.author !== null
                      ? `${article.author.firstName || ''} ${article.author.lastName || ''}`.trim()
                      : article.author}
                    </span>
                    <span>Submitted: {article.date}</span>
                    <span>{article.category}</span>
                  </div>
                  <div className="article-status">
                    <span className={`status-badge ${article.status.replace(' ', '')}`}> 
                      {getReviewStatus(article)}
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