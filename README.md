# 💰 Backend Ledger

A backend financial ledger system built with **Node.js, Express.js, MongoDB, and Mongoose**.

The project implements secure user authentication, account management, balance calculation through ledger entries, and transactional money transfers using MongoDB sessions. It also includes JWT-based authentication, token blacklisting, idempotency support, and email notifications.

---

## 🚀 Features

* 🔐 JWT-based user authentication
* 🍪 Cookie-based authentication
* 🔑 Password hashing with bcrypt
* 🚪 Secure logout with JWT token blacklisting
* 👤 User registration and login
* 💳 User account creation and management
* 💰 Account balance calculation from ledger entries
* 💸 Money transfer between accounts
* 🔄 Idempotent transaction handling
* 🧾 Debit/Credit ledger entries
* 🔒 MongoDB transactions for atomic money transfers
* 📧 Email notifications using Nodemailer
* 👑 System-user based initial fund transactions
* 🌱 Environment variable configuration
* 🧩 Modular MVC-style backend architecture

---

## 🛠️ Tech Stack

| Technology        | Purpose                   |
| ----------------- | ------------------------- |
| **Node.js**       | JavaScript runtime        |
| **Express.js**    | REST API framework        |
| **MongoDB**       | Database                  |
| **Mongoose**      | MongoDB ODM               |
| **JWT**           | Authentication            |
| **bcryptjs**      | Password hashing          |
| **cookie-parser** | Cookie handling           |
| **Nodemailer**    | Email notifications       |
| **dotenv**        | Environment configuration |
| **Nodemon**       | Development server        |

The project uses ES Modules and currently defines `dev` and `start` scripts through `nodemon` and Node.js respectively.

---

## 🏗️ Architecture

The backend follows a modular architecture:

```text
Client
  │
  ▼
Express Server
  │
  ├── Routes
  │     │
  │     ▼
  │   Middleware
  │     │
  │     ▼
  │ Controllers
  │     │
  │     ▼
  │   Models
  │     │
  │     ▼
  │   MongoDB
  │
  └── Services
        │
        └── Email Service
```

---

## 📁 Project Structure

```text
backend-ledger-main/
│
├── server.js
├── package.json
├── package-lock.json
├── .gitignore
│
└── src/
    │
    ├── app.js
    │
    ├── config/
    │   └── db.js
    │
    ├── controllers/
    │   ├── auth.controller.js
    │   ├── account.controller.js
    │   └── transaction.controller.js
    │
    ├── middleware/
    │   └── auth.middleware.js
    │
    ├── models/
    │   ├── user.model.js
    │   ├── account.model.js
    │   ├── transaction.model.js
    │   ├── ledger.model.js
    │   └── blackList.model.js
    │
    ├── routes/
    │   ├── auth.routes.js
    │   ├── account.routes.js
    │   └── transaction.routes.js
    │
    └── services/
        └── email.service.js
```

The current repository contains dedicated controllers, middleware, models, routes, services, and database configuration under `src`.

---

# 🔐 Authentication

The application uses **JWT-based authentication**.

When a user registers or logs in:

```text
User
  │
  ▼
Register / Login
  │
  ▼
Validate Credentials
  │
  ▼
Generate JWT
  │
  ▼
Store JWT in Cookie
  │
  ▼
Authenticated Requests
```

JWTs are currently generated with a **3-day expiration** and stored in a cookie named `token`.

### Registration

```http
POST /api/auth/register
```

Example request:

```json
{
  "name": "Kshitiz",
  "email": "kshitiz@example.com",
  "password": "your-password"
}
```

### Login

```http
POST /api/auth/login
```

Example request:

```json
{
  "email": "kshitiz@example.com",
  "password": "your-password"
}
```

### Logout

```http
POST /api/auth/logout
```

During logout, the token is stored in the blacklist collection and the authentication cookie is cleared.

---

# 💳 Account Management

Authenticated users can create accounts and retrieve their accounts.

### Create Account

```http
POST /api/accounts
```

🔒 Requires authentication.

### Get User Accounts

```http
GET /api/accounts
```

🔒 Requires authentication.

### Get Account Balance

```http
GET /api/accounts/balance/:accountId
```

🔒 Requires authentication.

The balance is obtained through the account model's `getBalance()` method rather than simply trusting a client-provided value.

---

# 💸 Transactions

The application supports transferring money between accounts.

### Create Transaction

```http
POST /api/transactions
```

🔒 Requires authentication.

Example request:

```json
{
  "fromAccount": "SOURCE_ACCOUNT_ID",
  "toAccount": "DESTINATION_ACCOUNT_ID",
  "amount": 500,
  "idempotencyKey": "unique-request-id"
}
```

---

## 🔄 Transaction Flow

A transfer follows a controlled transactional flow:

```text
Request
   │
   ▼
Validate Input
   │
   ▼
Check Idempotency Key
   │
   ▼
Verify Accounts
   │
   ▼
Check Account Status
   │
   ▼
Calculate Sender Balance
   │
   ▼
Start MongoDB Transaction
   │
   ├───────────────┐
   ▼               ▼
DEBIT Entry     CREDIT Entry
   │               │
   └───────┬───────┘
           ▼
   Mark Transaction
      COMPLETED
           │
           ▼
     Commit Transaction
           │
           ▼
     Send Notification
```

The implementation creates a transaction with `PENDING` status, creates a `DEBIT` ledger entry for the sender and a `CREDIT` ledger entry for the recipient, then marks the transaction as completed and commits the MongoDB session.

---

# 🧾 Ledger System

Each transfer creates corresponding ledger entries.

For example, if User A transfers ₹500 to User B:

```text
User A Account
     │
     └── DEBIT  ₹500

User B Account
     │
     └── CREDIT ₹500
```

This provides an auditable record of financial activity.

The ledger model is separated from the transaction model, allowing transactions and their financial entries to be represented independently.

---

# 🔁 Idempotency

Transactions use an `idempotencyKey` to help prevent duplicate processing of the same request.

Example:

```json
{
  "fromAccount": "account_A",
  "toAccount": "account_B",
  "amount": 500,
  "idempotencyKey": "TXN-123456"
}
```

If the same request is accidentally submitted multiple times, the idempotency mechanism helps prevent unintended duplicate transactions.

This is particularly important in financial systems where network retries can otherwise result in duplicate operations.

---

# 🔒 Atomic Transactions

Money transfers use **MongoDB sessions and transactions**.

Conceptually:

```text
START TRANSACTION

Create Transaction
      ↓
Create DEBIT entry
      ↓
Create CREDIT entry
      ↓
Mark Transaction COMPLETED

COMMIT
```

If an error occurs during the process, the operation does not proceed as a successfully completed transfer.

This provides stronger consistency than independently writing each operation.

---

# 👑 System User

The backend also provides a special flow for creating initial funds.

```http
POST /api/transactions/system/initial-funds
```

This endpoint is protected by a system-user authentication middleware.

It accepts:

```json
{
  "toAccount": "ACCOUNT_ID",
  "amount": 10000,
  "idempotencyKey": "INITIAL-FUNDS-001"
}
```

The system-user flow creates corresponding debit and credit ledger entries inside a MongoDB transaction.

---

# 📧 Email Notifications

The project integrates **Nodemailer** through a dedicated email service.

Registration sends a registration email, and successful transactions can trigger a transaction notification.

Email functionality is isolated inside:

```text
src/services/email.service.js
```

---

# 📡 API Reference

## Authentication

| Method | Endpoint             | Authentication | Description                |
| ------ | -------------------- | -------------- | -------------------------- |
| `POST` | `/api/auth/register` | Public         | Register a new user        |
| `POST` | `/api/auth/login`    | Public         | Login user                 |
| `POST` | `/api/auth/logout`   | Public         | Logout and blacklist token |

## Accounts

| Method | Endpoint                           | Authentication | Description         |
| ------ | ---------------------------------- | -------------- | ------------------- |
| `POST` | `/api/accounts`                    | 🔒 Required    | Create account      |
| `GET`  | `/api/accounts`                    | 🔒 Required    | Get user's accounts |
| `GET`  | `/api/accounts/balance/:accountId` | 🔒 Required    | Get account balance |

## Transactions

| Method | Endpoint                                 | Authentication | Description          |
| ------ | ---------------------------------------- | -------------- | -------------------- |
| `POST` | `/api/transactions`                      | 🔒 Required    | Transfer funds       |
| `POST` | `/api/transactions/system/initial-funds` | 👑 System User | Create initial funds |

The routes above correspond to the current route files in the repository.

---

# ⚙️ Environment Variables

Create a `.env` file in the root directory:

```env
MONGO_URI=your_mongodb_connection_string
JWT_SECRET=your_jwt_secret

EMAIL_USER=your_email
EMAIL_PASSWORD=your_email_password
```

> Use the exact variable names expected by your local `.env` configuration and email service implementation.

Never commit `.env` or expose database credentials, JWT secrets, or email credentials.

---

# 💻 Installation

### 1. Clone the repository

```bash
git clone https://github.com/kshitiz897981/backend-ledger-main.git
```

### 2. Navigate into the project

```bash
cd backend-ledger-main
```

### 3. Install dependencies

```bash
npm install
```

### 4. Configure environment variables

Create a `.env` file and add your MongoDB, JWT, and email configuration.

### 5. Start development server

```bash
npm run dev
```

### 6. Start production server

```bash
npm start
```

The current `server.js` connects to MongoDB and starts the Express application on **port 2000**.

```text
http://localhost:2000
```

---

# 🧪 Testing

The APIs can be tested using **Postman** or any REST API client.

Recommended testing flow:

```text
1. Register User
       ↓
2. Login
       ↓
3. Create Account
       ↓
4. Check Account
       ↓
5. Create / Seed Initial Funds
       ↓
6. Transfer Funds
       ↓
7. Check Balance
       ↓
8. Logout
```

---

# 🧠 Key Concepts Implemented

This project demonstrates practical backend concepts including:

* REST API design
* MVC architecture
* Express middleware
* JWT authentication
* Cookie-based authentication
* Password hashing
* MongoDB schema design
* Mongoose models
* MongoDB sessions
* Database transactions
* Atomic financial operations
* Idempotency
* Ledger-based balance calculation
* Authentication middleware
* Token blacklisting
* Email services
* Environment-based configuration

---

# 🔮 Future Improvements

Possible improvements for future versions:

* Refresh-token based authentication
* HTTP-only and secure cookie configuration
* Input validation using Zod/Joi
* Rate limiting
* Helmet security headers
* API documentation with Swagger/OpenAPI
* Automated unit and integration tests
* Docker support
* CI/CD pipeline
* Transaction history APIs
* Pagination and filtering
* Improved error-handling middleware
* Production deployment

---

## 👨‍💻 Author

**Kshitiz Varshney**

Backend / Full Stack Developer

GitHub:
https://github.com/kshitiz897981

---

## ⭐ Project

If you find this project useful, consider giving the repository a ⭐.

Repository:
https://github.com/kshitiz897981/backend-ledger-main
