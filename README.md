# 📚 E-Book Management System

A full-stack web application developed to manage digital books efficiently.  
This project allows users to browse, search, and manage e-books through a user-friendly interface, while administrators can manage book records, categories, and user-related operations.

The application is built using **React.js** for the frontend, **Python with Django/Django REST Framework** for the backend, **MySQL** as the database, and **Postman** for API testing.

---

## 🚀 Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Axios
- Bootstrap / Tailwind CSS *(if used)*

### Backend
- Python
- Django
- Django REST Framework (DRF)

### Database
- MySQL

### API Testing
- Postman

### Version Control
- Git & GitHub

---

## 📌 Features

- User Registration and Login
- JWT / Token-based Authentication
- View Available E-Books
- Search Books by Title / Author / Category
- Add New Books (Admin)
- Update Book Details
- Delete Books
- Manage Categories
- API Integration between Frontend and Backend
- Responsive User Interface
- RESTful API Development
- API Testing using Postman

---

## 🏗️ Project Architecture

```text
Frontend (React.js)
        ↓
 REST API Calls (Axios)
        ↓
Backend (Django + Django REST Framework)
        ↓
     MySQL Database

E-book-management/
│
├── frontend/                         # React frontend
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── services/
│   │   ├── App.js
│   │   └── index.js
│   └── package.json
│
├── backend/                         # Django backend
│   ├── accounts/                    # User authentication and account management
│   ├── authors/                     # Author management
│   ├── books/                       # Book CRUD operations
│   ├── categories/                  # Category management
│   ├── core/                        # Project core settings / utilities
│   ├── dashboard/                   # Admin dashboard / analytics
│   ├── favorites/                   # Favorite books functionality
│   ├── history/                     # Reading / activity history
│   ├── media/                       # Uploaded media files
│   ├── .env                         # Environment variables (not for public sharing)
│   ├── .env.example                 # Example environment config
│   ├── fix_pdfs.py                  # PDF-related utility script
│   ├── seed.py                      # Sample data seeding script
│   ├── manage.py                    # Django management entry point
│   └── requirements.txt             # Python dependencies
│
├── postman_collection/              # Optional Postman collection
│
└── README.md
