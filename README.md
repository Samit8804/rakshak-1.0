# SafeFind Full-Stack Template

This repository contains a full-stack authentication system with a protected dashboard for submitting missing-person reports.

## Tech Stack
- Frontend: React (Vite feel)
- Backend: Node.js + Express
- Database: MongoDB
- Authentication: JWT

## Setup

1) Backend
- Ensure MongoDB is running locally (or set MONGODB_URI to a remote instance).
- Copy backend/.env.example to backend/.env and set MONGODB_URI and JWT_SECRET.
- Install: `cd backend && npm install`
- Start: `cd backend && npm start` (defaults to port 5000)

2) Frontend
- Ensure the frontend proxy is configured to talk to the backend (proxy is set in the frontend config).
- Install: `cd frontend && npm install`
- Start: `cd frontend && npm run dev` (Vite)

## How it works
- On load, the app shows the login page. Users can signup or login.
- Successful login/signup stores a JWT in localStorage and redirects to /dashboard.
- The dashboard is protected and requires a valid JWT. Users can submit missing-person reports which are saved to MongoDB.
- Logout clears the token and redirects to login.

-## API Endpoints (backend)
- POST /api/auth/signup — create a new user, returns JWT
- POST /api/auth/login — login, returns JWT
- POST /api/report — submit a missing report (protected, requires Authorization: Bearer <token>)
- GET /api/report/mine — get current user's reports (protected)
- Seed: run backend script to seed sample data

## Seed Data
- Run: `cd backend && npm run seed` to populate demo user and sample reports

## Notes
- Passwords are hashed with bcrypt.
- JWTs are used to protect routes.

## Admin Endpoints and Seed
- GET /api/report/all — list all reports (admin only)
- Admin seed: an admin user is seeded as admin@safefind.local with password adminpass
- You can login as admin and browse /admin/reports after signing in.
