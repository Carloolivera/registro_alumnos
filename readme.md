# Student API Documentation

---

## 📍 Introduction

This is an educational REST API for managing a simple database of students. It allows you to:

- Register new students.
- Query students by ID.
- Query students by career.
- Delete students.

Student data is persisted using a local JSON file (`students.json`) to simulate a database.

---

## 🔍 Base URL

```bash
http://localhost:5001/api/students
```

The server must be running on port `5001`.

---

## 🔒 Authentication

All requests must include an **API Key** in the Authorization header:

```text
Authorization: Bearer 12345ABCDEF
```

If the key is missing or incorrect, the server will respond with `401 Unauthorized`.

---

## 🔍 Endpoints

### 1. Register New Student

- **URL**: `/api/students`
- **Method**: `POST`
- **Headers**:
  - `Content-Type: application/json`
  - `Authorization: Bearer 12345ABCDEF`
- **Body**:

```json
{
  "name": "John Doe",
  "career": "Engineering"
}
```

- **Success Response**:
  - **Code**: `201 Created`
  - **Content**:

```json
{
  "message": "Student registered successfully.",
  "student": {
    "id": 51,
    "name": "John Doe",
    "career": "Engineering"
  }
}
```

### 2. Get Student by ID

- **URL**: `/api/students/:id`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Success Response**:
  - **Code**: `200 OK`
  - **Content**:

```json
{
  "id": 1,
  "name": "Alice Johnson",
  "career": "Engineering"
}
```

- **Error Response**:
  - **Code**: `404 Not Found`

```json
{
  "error": "Student not found."
}
```

### 3. Get Students by Career

- **URL**: `/api/students?career=CareerName`
- **Method**: `GET`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Example**:

```bash
GET /api/students?career=Engineering
```

- **Success Response**:
  - **Code**: `200 OK`
  - **Content** (array of matching students):

```json
[
  {
    "id": 1,
    "name": "Alice Johnson",
    "career": "Engineering"
  },
  {
    "id": 6,
    "name": "Fiona Miller",
    "career": "Engineering"
  }
]
```

- **Error Response**:
  - **Code**: `400 Bad Request` if `career` is missing.

```json
{
  "error": "Career filter is required."
}
```

### 4. Delete Student by ID

- **URL**: `/api/students/:id`
- **Method**: `DELETE`
- **Headers**:
  - `Authorization: Bearer 12345ABCDEF`

- **Success Response**:
  - **Code**: `200 OK`

```json
{
  "message": "Student deleted successfully."
}
```

- **Error Response**:
  - **Code**: `404 Not Found`

```json
{
  "error": "Student not found for deletion."
}
```

---

## 💡 Notes

- All responses are in JSON format.
- If you modify the students (add/delete), changes are saved automatically to `students.json`.
- Restarting the server preserves the updated list thanks to JSON persistence.

---

## 💼 Example Authorization Header

```text
Authorization: Bearer 12345ABCDEF
```

This must be included in every request.

---

# 📖 Educational Objectives

- Practice sending requests to a REST API.
- Learn about HTTP methods: `GET`, `POST`, `DELETE`.
- Understand JSON data format.
- Experience basic server-side persistence.
- Manage authentication with API keys.

---

**Happy coding! 🚀**

