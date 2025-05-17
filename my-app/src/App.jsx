import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';

// Компоненты
import Header from './components/Header';
import Footer from './components/Footer';
import './App.css'

// Автор
import AuthorProfile from './components/AuthorProfile';
import AuthorArticles from './components/AuthorArticles';
import SubmitArticle from './components/SubmitArticle';

// Рецензент
import ReviewerProfile from './components/ReviewerProfile';
import InProgressReviews from './components/InProgressReviews';
import CompletedReviews from './components/CompletedReviews';

// Админ
import AdminArticles from './components/AdminArticles';
import UserManagement from './components/UserManagement';

// Регистрация
import UserRegistration from './components/UserRegistration';

//Роман: AdminDashboard объединяет управление пользователями и статьями
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminEmail');
    navigate('/register');
  };

  // Прокидываем функцию логаута в UserManagement
  return (
    <div className="profile-section" style={{ position: 'relative', marginTop: 32 }}>
      <button
        onClick={handleLogout}
        style={{ position: 'absolute', right: 32, top: 24, padding: '10px 24px', background: '#f5f5f5', border: 'none', borderRadius: 8, cursor: 'pointer', fontWeight: 500, zIndex: 2 }}
      >
        Logout
      </button>
      <div className="tabs">
        <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>User Management</div>
        <div className={`tab ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>Articles</div>
      </div>
      {activeTab === 'users' && (
        <UserManagement onAdminDeleted={handleLogout} />
      )}
      {activeTab === 'articles' && (
        <AdminArticles />
      )}
    </div>
  );
}

function App() {
  // Состояния для вкладок
  const [activeTab, setActiveTab] = useState('profile');
  const [activeReviewerTab, setActiveReviewerTab] = useState('inProgress');
  //const [activeAdminTab, setActiveAdminTab] = useState('users');

  return (
    <Router>
      <div className="app">
        <Header />
        <main className="container">
          <Routes>
            {/* Главная страница */}
            <Route path="/" element={<Navigate to="/register" />} /> {/* Перенаправляем на /register */}

            {/* Автор */}
            <Route path="/author-profile" element={
              <AuthorProfile activeTab={activeTab} setActiveTab={setActiveTab} />
            } />
            <Route path="/author-articles" element={
              <AuthorArticles activeTab={activeTab} setActiveTab={setActiveTab} />
            } />
            <Route path="/submit-article" element={
              <SubmitArticle activeTab={activeTab} setActiveTab={setActiveTab} />
            } />

            {/* Рецензент */}
            <Route path="/reviewer-profile" element={
              <ReviewerProfile 
                activeReviewerTab={activeReviewerTab} 
                setActiveReviewerTab={setActiveReviewerTab} 
              />
            } />
            <Route path="/in-progress-reviews" element={
              <InProgressReviews 
                activeReviewerTab={activeReviewerTab} 
                setActiveReviewerTab={setActiveReviewerTab} 
              />
            } />
            <Route path="/completed-reviews" element={
              <CompletedReviews 
                activeReviewerTab={activeReviewerTab} 
                setActiveReviewerTab={setActiveReviewerTab} 
              />
            } />

            {/* Админ */}
            <Route path="/admin-users" element={<AdminDashboard />} />
            <Route path="/admin-articles" element={<AdminDashboard />} />
            <Route path="/admin-dashboard" element={<AdminDashboard />} />

            {/* Регистрация */}
            <Route path="/register" element={<UserRegistration />} />
          </Routes>
        </main>
        <Footer />
      </div>
    </Router>
  );
}

export default App;