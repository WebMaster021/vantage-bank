# Vantage Bank 🏦

Vantage Bank is a secure, full-stack banking application built to practice backend engineering concepts such as authentication, transactional integrity, and database versioning, along with a modern frontend interface.

---

## 🚀 Tech Stack

**Backend**
- Java 17
- Spring Boot 3
- Spring Security (JWT & BCrypt)
- JPA / Hibernate
- PostgreSQL

**Frontend**
- React (Vite)
- TypeScript
- Tailwind CSS
- Axios

**Database**
- PostgreSQL

---

## ✨ Features

- **Secure Authentication**
  - User registration and login using BCrypt password hashing
  - Stateless JWT-based authentication and authorization

- **Account Management**
  - Support for creating and managing Savings and Checking accounts

- **Transactional Operations**
  - Deposit, withdrawal, and fund transfer functionality
  - ACID-compliant transaction handling using transactional boundaries

- **User Dashboard**
  - View account balances and transaction history
  - Consistent data synchronization between backend APIs and frontend UI

---

## 🛠️ How to Run the Project

### Backend
1. Open the `src/main/resources` in IntelliJ IDEA  
2. Update `application.properties` with your PostgreSQL credentials  
3. Run `VantageBankApplication.java`

### Frontend
1. Open the `frontend` folder  
2. Run `npm install`  
3. Run `npm run dev`

---

## 📌 Notes
This project was built as a learning exercise to understand real-world backend concepts such as security configuration, transaction management, and database migrations using Flyway.
