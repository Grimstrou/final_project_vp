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

//Роман: AdminDashboard объединяет управление пользователями и статьями
function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('users');
  const [users, setUsers] = useState([
    { id: 1, name: 'John Doe', role: 'Editor', status: 'active', avatar: '/images/dog-1.png' },
    { id: 2, name: 'Jane Smith', role: 'Reviewer', status: 'active', avatar: '/images/dog-1.png' },
    { id: 3, name: 'Mike Johnson', role: 'Author', status: 'inactive', avatar: '/images/dog-1.png' }
  ]);
  const [articles, setArticles] = useState([
    { id: 1, title: "Machine Learning Advances", author: "Sarah Johnson", status: "published", date: "May 4, 2025" },
    { id: 2, title: "Blockchain in Healthcare", author: "Michael Chen", status: "pending", date: "May 3, 2025" },
    { id: 3, title: "Sustainable Energy Solutions", author: "Emma Watson", status: "rejected", date: "May 2, 2025" }
  ]);

  //Роман: Добавление пользователя
  const handleAddUser = (user) => setUsers([...users, user]);
  //Роман: Удаление пользователя
  const handleDeleteUser = (id) => setUsers(users.filter(u => u.id !== id));
  //Роман: Блокировка/разблокировка пользователя
  const handleToggleUserStatus = (id) => setUsers(users.map(u => u.id === id ? { ...u, status: u.status === 'active' ? 'inactive' : 'active' } : u));
  //Роман: Удаление статьи
  const handleDeleteArticle = (id) => setArticles(articles.filter(a => a.id !== id));

  return (
    <div>
      <div className="tabs">
        <div className={`tab ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>User Management</div>
        <div className={`tab ${activeTab === 'articles' ? 'active' : ''}`} onClick={() => setActiveTab('articles')}>Articles</div>
      </div>
      {activeTab === 'users' && (
        <UserManagement
          users={users}
          setUsers={setUsers}
          onAddUser={handleAddUser}
          onDeleteUser={handleDeleteUser}
          onToggleUserStatus={handleToggleUserStatus}
        />
      )}
      {activeTab === 'articles' && (
        <AdminArticles
          articles={articles}
          setArticles={setArticles}
          onDeleteArticle={handleDeleteArticle}
        />
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