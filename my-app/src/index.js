import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';         // глобальные стили для всего приложения
import App from './App';     // главный компонент

// Если вы используете CSS-файл main.css — импортируйте его здесь
// import './styles/main.css'; ← убедитесь, что файл существует

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);