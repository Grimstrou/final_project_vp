import React, { useState, useEffect } from 'react';
import { API_ENDPOINTS } from '../config';
import SubmitArticle from './SubmitArticle';
import AuthorArticles from './AuthorArticles';
import { useNavigate } from 'react-router-dom';

export default function AuthorProfile() {
  // Активная вкладка
  const [activeTab, setActiveTab] = useState(() => localStorage.getItem('authorTab') || 'profile');

  // Редактирование профиля
  const [isEditing, setIsEditing] = useState(false);

  // Данные профиля
  const [profile, setProfile] = useState(null);

  // ID автора
  const [authorId, setAuthorId] = useState(null);
  const navigate = useNavigate();

  // Сохранение текущей вкладки
  useEffect(() => {
    localStorage.setItem('authorTab', activeTab);
  }, [activeTab]);

  // Получаем ID автора из localStorage
  useEffect(() => {
    const id = localStorage.getItem('authorId');
    setAuthorId(id);
  }, []);

  // Загрузка данных профиля
  useEffect(() => {
    if (authorId) {
      fetchProfile();
    }
  }, [authorId]);

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

  // Обработчики формы профиля
  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
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

  const handleLogout = () => {
    localStorage.removeItem('authorId');
    localStorage.removeItem('authorTab');
    navigate('/register');
  };

  return (
    <div className="container">
      {/* Навигация по вкладкам */}
      <div className="tabs">
        <div className={`tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
          Profile
        </div>
        <div className={`tab ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>
          My Articles
        </div>
        <div className={`tab ${activeTab === 'submit' ? 'active' : ''}`} onClick={() => setActiveTab('submit')}>
          Submit Article
        </div>
        <div className={`tab ${activeTab === 'review' ? 'active' : ''}`} onClick={() => setActiveTab('review')}>
          Review Articles
        </div>
      </div>

      {/* Вкладка: Профиль */}
      {activeTab === 'profile' && (
        <section className="profile-section" style={{ position: 'relative' }}>
          <div className="profile-header">
            <div>
              <img src="/images/dog-1.png" alt="User avatar" style={{
                width: 60,
                height: 60,
                borderRadius: '50%',
                objectFit: 'cover',
                marginBottom: 8
              }} />
              <h1 className="profile-title">
                {isEditing ? (
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
                )}
              </h1>
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
            style={{
              position: 'absolute',
              right: 32,
              bottom: 32,
              padding: '10px 24px',
              background: '#f5f5f5',
              border: 'none',
              borderRadius: 8,
              cursor: 'pointer',
              fontWeight: 500
            }}
          >
            Logout
          </button>
        </section>
      )}

      {/* Вкладка: Мои статьи */}
      {activeTab === 'articles' && (
        <section className="articles-section">
          <h2 className="profile-title">My Articles</h2>
          <AuthorArticles authorId={authorId} />
        </section>
      )}

      {/* Вкладка: Отправить статью */}
      {activeTab === 'submit' && (
        <section className="form-section">
          <h2 className="form-title">Submit New Article</h2>
          <SubmitArticle authorId={profile?.id} onArticleAdded={() => {}} />
        </section>
      )}

      {/* Вкладка: Статьи на рецензии */}
      {activeTab === 'review' && (
        <section className="articles-section">
          <h2 className="profile-title">Articles Under Review</h2>
          <p>В разработке...</p>
        </section>
      )}
    </div>
  );
}