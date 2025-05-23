# 📘 Платформа прозрачного рецензирования

---

## 🧑‍💻 Участники команды

| Имя | Роль | Ответственность |
|-----|------|------------------|
| Участник 1 | Фронтенд-разработчик А | Интерфейс автора, общие страницы |
| Участник 2 | Фронтенд-разработчик Б | Интерфейс рецензента и администратора |
| Участник 3 | Бэкенд-разработчик | API, логика, база данных |

---

## 🛠️ Технологии

| Слой | Используемые технологии |
|------|--------------------------|
| Фронтенд | React, JavaScript, HTML, CSS |
| Бэкенд | C# (.NET), ASP.NET Core |
| База данных | PostgreSQL через SQL и Entity Framework |

---

## 📋 Распределение задач

### 🧑‍💻 Фронтенд-разработчик А (Участник 1)

#### Основные задачи:
- Главная страница с описанием платформы
- Страницы регистрации и входа
- Личный кабинет: отображение и редактирование информации пользователя
- Форма загрузки статьи (PDF/DOCX)
- Список статей автора с текущими статусами:
  - не рецензировано
  - отправлено на доработку
  - принято к публикации
  - отклонено
- Общие компоненты:
  - кнопки, формы, навигационное меню, уведомления

---

### 🧑‍💻 Фронтенд-разработчик Б (Участник 2)

#### Основные задачи:
- Страница со списком доступных статей для рецензирования
- Форма написания рецензии:
  - текстовое поле
  - выбор статуса статьи (доработка / принято / отклонено)
- История рецензий пользователя
- Страница администратора:
  - таблица пользователей (создание, удаление, блокировка)
  - таблица статей (просмотр, удаление)
- Реализация ограничений по ролям:
  - только автор может отправлять статьи
  - только рецензент может писать рецензии
  - только администратор может управлять системой

---

### 👨‍💻 Бэкенд-разработчик (Участник 3)

#### Основные задачи:
- Настройка сервера на C# (.NET 6+ / ASP.NET Core)
- Создание REST API
- Работа с PostgreSQL через Entity Framework
- Аутентификация и авторизация (JWT, bcrypt)

#### Основная логика:
- Регистрация и вход
- Загрузка файла (PDF/DOCX)
- Назначение статей нескольким рецензентам
- Первый согласившийся берёт статью
- Получение и сохранение рецензий
- CRUD операции для администратора
