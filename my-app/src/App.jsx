import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

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

function App() {
  // Состояния для вкладок
  const [activeTab, setActiveTab] = useState('profile');
  const [activeReviewerTab, setActiveReviewerTab] = useState('inProgress');
  const [activeAdminTab, setActiveAdminTab] = useState('users');

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
            <Route path="/admin-users" element={
              <UserManagement 
                activeAdminTab={activeAdminTab} 
                setActiveAdminTab={setActiveAdminTab} 
              />
            } />
            <Route path="/admin-articles" element={
              <AdminArticles 
                activeAdminTab={activeAdminTab} 
                setActiveAdminTab={setActiveAdminTab} 
              />
            } />

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