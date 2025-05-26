# 📚 Book Review API

A Node.js + Express.js REST API for managing books and their reviews, with authentication and role-based access.

---

## 🚀 Features

- JWT-based user authentication (`/auth/signup`, `/auth/login`)
- Book management (add, list, search, details)
- Review system (add, edit, delete reviews for books)
- Pagination for listing books and reviews
- MongoDB with Mongoose ODM

---

## ⚙️ Project Setup

1. **Clone the repository:**

    ```bash
    git clone https://github.com/your-username/book-review-api.git
    cd book-review-api
    ```

2. **Install dependencies:**

    ```bash
    npm install
    ```

3. **Environment variables:**

    Create a `.env` file in the root:

    ```bash
    MONGO_URI=your_mongodb_connection_string
    JWT_SECRET=your_jwt_secret
    PORT=3000
    ```

4. **Start the server:**

    ```bash
    npm start
    ```

    The API will be running at `http://localhost:3000/`

---

## 🧪 How to Run Locally

```bash
npm install
npm start
```
---

# Example API requests (with curl or Postman)

### ✅ Signup
```bash
curl -X POST http://localhost:3000/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456"}'
```

### 🔑 Login
```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"john","password":"123456"}'
```

---

## 📘 Book Routes

### ➕ Add a book (requires JWT)
```bash
curl -X POST http://localhost:3000/books \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"title":"Book Title","author":"Author","genre":"Fiction"}'
```

### 📄 Get paginated list of books
```bash
curl http://localhost:3000/books?page=1&limit=5
```

### 🔍 Get book details with reviews
```bash
curl http://localhost:3000/books/<book_id>
```

### 🔎 Search books
```bash
curl http://localhost:3000/books/search?query=title
```

---

## ✍️ Review Routes

### 📝 Add a review
```bash
curl -X POST http://localhost:3000/books/<book_id>/reviews \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"rating":5,"comment":"Amazing read!"}'
```

### 🖊️ Update a review
```bash
curl -X PUT http://localhost:3000/reviews/<review_id> \
  -H "Authorization: Bearer <JWT_TOKEN>" \
  -H "Content-Type: application/json" \
  -d '{"rating":4,"comment":"Edited comment"}'
```

### ❌ Delete a review
```bash
curl -X DELETE http://localhost:3000/reviews/<review_id> \
  -H "Authorization: Bearer <JWT_TOKEN>"
```

---

## 🛠️ Tools

- Use [Postman](https://www.postman.com/) or `curl` to test these endpoints.
- Make sure to replace `<JWT_TOKEN>`, `<book_id>`, and `<review_id>` with actual values.

---

## 📌 Note
- Ensure your server is running at `http://localhost:3000` before making any API requests.
---

# 🧠 Design Decisions & Assumptions

### 🔐 Authentication
- JWT is used for stateless auth; tokens expire in 1 day and are required via the `Authorization` header.
- Passwords are hashed using `bcryptjs` for security.

### 🗃️ Data Modeling
- MongoDB with Mongoose defines schemas for `User`, `Book`, and `Review`.
- Relationships are maintained using `ObjectId` references.
- `populate()` is used to join data (e.g., user info in reviews).

### ✍️ Review Constraints
- Each user can review a book only once.
- Users can only update or delete their own reviews.
- Constraints are enforced via controller logic.

### 🧩 API Structure
- Follows REST principles with clean route separation: `/books`, `/reviews`, `/auth`.
- Middleware handles JWT validation globally for protected routes.

### 🔎 Search & Pagination
- Search supports partial and case-insensitive matching on book title and author using `RegExp`.
- Pagination is handled via `page` and `limit` query parameters using Mongoose's `.skip()` and `.limit()`.

### ❗ Error Handling
- Uses consistent JSON responses with status codes:
  - `400` for bad input
  - `401` for auth errors
  - `403` for forbidden actions
  - `404` for not found

### ⚙️ Environment Configuration
- Secrets (JWT key, DB URI) are stored in `.env` and managed using `dotenv`.

---

# 🗄️ Database Schema

### 👤 User
| Field     | Type     | Description               |
|-----------|----------|---------------------------|
| _id       | ObjectId | Primary key               |
| username  | String   | Unique, required          |
| password  | String   | Hashed using bcryptjs     |
| createdAt | Date     | Timestamp (default: now)  |

### 📚 Book
| Field     | Type     | Description                        |
|-----------|----------|------------------------------------|
| _id       | ObjectId | Primary key                        |
| title     | String   | Required                           |
| author    | String   | Required                           |
| genre     | String   | Optional                           |
| reviews   | [ObjectId] | Array of Review references       |
| createdAt | Date     | Timestamp (default: now)           |

### ✍️ Review
| Field     | Type     | Description                        |
|-----------|----------|------------------------------------|
| _id       | ObjectId | Primary key                        |
| rating    | Number   | Required, typically 1 to 5         |
| comment   | String   | Optional                           |
| user      | ObjectId | Reference to `User` (reviewer)     |
| book      | ObjectId | Reference to `Book`                |
| createdAt | Date     | Timestamp (default: now)           |

### 🔗 Relationships
- A `Book` can have **many Reviews**.
- A `Review` is linked to **one Book** and **one User**.
- A `User` can write **multiple Reviews**, but only one per book.

### 📝 Notes
- Schemas are defined using Mongoose.
- `populate()` is used to fetch associated user and book data when retrieving reviews.
- Indexes (e.g., on `username`, `book`, `user`) can be added for performance.
---
![ER Diagram](https://github.com/user-attachments/assets/999e40a2-7c22-4b82-9b7d-2e754dd8eaa8)

---

