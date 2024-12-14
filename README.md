# EngineeringMarketplace
React.js || Django || PostgreSQL
**Engineering Construction Marketplace** tech stack from scratch, step by step .pyI’ll walk you through it in simple terms.

---

### **1. Understand What We’re Setting Up**
We’re building:
1. **Backend**: Using Django and Django REST Framework (Python).
2. **Frontend**: Using React.js (JavaScript) for user interfaces.
3. **Database**: Using PostgreSQL to store your data.

Let’s begin with tools installation!

---

### **2. Install Required Tools**
Here’s what you need to install on your computer:

#### **Backend: Django (Python)**
1. **Install Python**:
   - Download Python from [python.org/downloads](https://www.python.org/downloads).
   - Install it, and make sure to check the box **"Add Python to PATH"** during installation.

2. **Install pip (Python Package Manager)**:
   - Open your terminal and type:
     ```bash
     python --version
     pip --version
     ```
   - If you see version numbers, Python and pip are ready!

#### **Frontend: React.js**
1. **Install Node.js**:
   - Download Node.js from [nodejs.org](https://nodejs.org).
   - This will also install **npm (Node Package Manager)**.

2. **Verify Installation**:
   - Open your terminal and type:
     ```bash
     node --version
     npm --version
     ```
   - If you see version numbers, Node.js and npm are ready!

#### **Database: PostgreSQL**
1. **Install PostgreSQL**:
   - Download PostgreSQL from [postgresql.org](https://www.postgresql.org/).
   - During installation:
     - Set a **username** (default: `postgres`).
     - Set a **password** you’ll remember.

2. **Verify Installation**:
   - Open your terminal and type:
     ```bash
     psql --version
     ```
   - If you see a version number, PostgreSQL is ready!

#### **Version Control: Git**
1. **Install Git**:
   - Download Git from [git-scm.com](https://git-scm.com/).

2. **Verify Installation**:
   - Open your terminal and type:
     ```bash
     git --version
     ```
   - If you see a version number, Git is ready!

---

### **3. Set Up Your Backend**
We’ll create the **Django backend** now.

#### **Step 1: Create a New Folder for Your Project**
1. Open your terminal.
2. Create a folder:
   ```bash
   mkdir EngineeringMarketplace
   cd EngineeringMarketplace
   ```

#### **Step 2: Set Up a Virtual Environment**
1. Create a virtual environment:
   ```bash
   python -m venv env
   ```
2. Activate the virtual environment:
   - On Windows:
     ```bash
     env\Scripts\activate
     ```
   - On Mac/Linux:
     ```bash
     source env/bin/activate
     ```

#### **Step 3: Install Django and Django REST Framework**
1. Install the libraries:
   ```bash
   pip install django djangorestframework psycopg2
   ```

#### **Step 4: Start a Django Project**
1. Create a Django project:
   ```bash
   django-admin startproject backend
   cd backend
   ```

2. Run the server to ensure everything works:
   ```bash
   python manage.py runserver
   ```
3. Open **http://127.0.0.1:8000** in your browser. You should see the Django welcome page.

---

### **4. Set Up Your Database**
Let’s configure PostgreSQL in Django.

#### **Step 1: Create a Database**
1. Open PostgreSQL:
   ```bash
   psql -U postgres
   ```
2. Create a database:
   ```sql
   CREATE DATABASE construction_db;
   CREATE USER your_username WITH PASSWORD 'your_password';
   GRANT ALL PRIVILEGES ON DATABASE construction_db TO your_username;
   \q
   ```

#### **Step 2: Connect Django to PostgreSQL**
1. Open `backend/settings.py` and update the `DATABASES` section:
   ```python
   DATABASES = {
       'default': {
           'ENGINE': 'django.db.backends.postgresql',
           'NAME': 'construction_db',
           'USER': 'your_username',
           'PASSWORD': 'your_password',
           'HOST': 'localhost',
           'PORT': '5432',
       }
   }
   ```

2. Apply migrations:
   ```bash
   python manage.py makemigrations
   python manage.py migrate
   ```

---

### **5. Set Up Your Frontend**
Let’s create the **React.js frontend** now.

#### **Step 1: Create a React App**
1. In the terminal, navigate to the main folder (`EngineeringMarketplace`).
2. Create a React app:
   ```bash
   npx create-react-app frontend
   cd frontend
   ```

#### **Step 2: Start React**
1. Run the development server:
   ```bash
   npm start
   ```
2. Open **http://localhost:3000** in your browser. You should see the React welcome page.

#### **Step 3: Install Dependencies**
1. Install necessary libraries:
   ```bash
   npm install axios @mui/material @emotion/react @emotion/styled react-router-dom
   ```

#### **Step 4: Connect Frontend to Backend**
1. Create an API file in React (`frontend/src/services/api.js`):
   ```javascript
   import axios from 'axios';

   const api = axios.create({
       baseURL: 'http://127.0.0.1:8000/api/',
   });

   export default api;
   ```

---

### **6. GitHub Setup**
Let’s save your code online using GitHub.

#### **Step 1: Initialize Git**
1. For **backend**:
   ```bash
   cd backend
   git init
   git add .
   git commit -m "Initial backend setup"
   ```

2. For **frontend**:
   ```bash
   cd ../frontend
   git init
   git add .
   git commit -m "Initial frontend setup"
   ```

#### **Step 2: Push to GitHub**
1. Create two repositories on GitHub (one for backend, one for frontend).
2. Push your code to GitHub:
   - For **backend**:
     ```bash
     git remote add origin https://github.com/your_username/backend-repo.git
     git branch -M main
     git push -u origin main
     ```
   - For **frontend**:
     ```bash
     git remote add origin https://github.com/your_username/frontend-repo.git
     git branch -M main
     git push -u origin main
     ```

---

### **Next Steps**
1. Test your setup:
   - Run the backend server: `python manage.py runserver`
   - Run the frontend server: `npm start`
2. Test API integration using React and Axios.
