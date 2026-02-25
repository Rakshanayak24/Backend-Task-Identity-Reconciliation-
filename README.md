# 🚀 Bitespeed Backend Task — Identity Reconciliation

Backend service to consolidate customer identities across multiple purchases by linking contacts using email and/or phone number.

---

## ✅ Tech Stack

- Node.js
- TypeScript
- Express.js
- Prisma ORM
- SQLite (can be replaced with PostgreSQL/MySQL)
- REST API

---

## 📦 Project Setup (Local Run Instructions)

### 1️⃣ Clone or Download Project

```bash
git clone <your-repository-url>
cd bitespeed_FINAL_submission
```
OR extract the ZIP file and open folder in VS Code.

### 2️⃣ Install Dependencies
```bash
npm install
```

### 3️⃣ Setup Database (Prisma Migration)
Create database and tables:
```bash
npx prisma migrate dev --name init
```
This will:
Create SQLite database (dev.db)
Generate Prisma Client

### 4️⃣ Start Backend Server
```bash
npm run dev
```
You should see:
Server running http://localhost:3000

### 🌐 API Endpoint
Base URL:
http://localhost:3000
### 🧪 Test API
Endpoint
```bash
POST /identify
```
Full URL:
```bash
http://localhost:3000/identify
```
📩 Request Body (JSON)
Use JSON body (NOT form-data):
```bash
{
  "email": "test@mail.com",
  "phoneNumber": "123456"
}
```
At least one field is required.

✅ Example Response
```bash
{
  "contact": {
    "primaryContactId": 1,
    "emails": [
      "test@mail.com"
    ],
    "phoneNumbers": [
      "123456"
    ],
    "secondaryContactIds": []
  }
```
## 🧰 How To Test

You can test using:
Thunder Client (VS Code Extension)
Postman
CURL

Example CURL:
```bash
curl -X POST http://localhost:3000/identify \
-H "Content-Type: application/json" \
-d "{\"email\":\"test@mail.com\",\"phoneNumber\":\"123456\"}"
☁️ Deployment
```
This project can be easily deployed on:
Render
Railway
Expose the /identify endpoint publicly after deployment.

