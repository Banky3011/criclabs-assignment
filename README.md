# Criclabs Assignment

## Prerequisites
- Node.js 18+ installed

## 1. Start the API Server
```bash
cd server
npm install
npm run dev
```
Default server runs on `http://localhost:3001`.

### Environment Variables (optional)
Create `server/.env`:
```
PORT=3001
JWT_SECRET=your-super-secret-jwt-key
```

## 2. Start the Web Client
Open a new terminal:
```bash
cd web
npm install
npm run dev
```
Vite defaults to `http://localhost:5173`.

## 3. Register a User (Postman)
Endpoint: `POST http://localhost:3001/api/auth/register`

### Request Body (JSON)
```json
{
  "email": "test@example.com",
  "password": "test123456"
}
```
