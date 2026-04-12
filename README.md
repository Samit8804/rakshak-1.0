# 🚀 Rakshak - Women Safety & Missing Person Platform

A full-stack web application for women safety and missing person identification using AI-powered face recognition.

## 📋 Prerequisites

- Node.js (v18+)
- Python (v3.8+)
- MongoDB (v6.0+)
- npm or yarn

## 🛠️ Installation & Setup

### 1. MongoDB Setup
```bash
# Install and start MongoDB locally, or use MongoDB Atlas
# Update MONGO_URI in rakshak-backend/.env if using cloud MongoDB
```

### 2. Backend Setup
```bash
cd rakshak-backend
npm install
# Create uploads/cases and uploads/sightings folders manually if needed
npm start
# Backend runs on http://localhost:5000
```

### 3. AI Service Setup
```bash
cd rakshak-ai
pip install -r requirements.txt
# Note: face_recognition may need CMake and dlib installed
python app.py
# AI service runs on http://localhost:5001
```

### 4. Frontend Setup
```bash
cd rakshak-frontend
npm install
npm run dev
# Frontend runs on http://localhost:3000
```

## 🔑 Default Admin Account
After registration with role "Admin", you can access the admin dashboard at `/admin`

## 📁 Project Structure

```
rakshak/
├── rakshak-backend/        # Node.js + Express API
│   ├── models/            # Mongoose models
│   ├── routes/            # API routes
│   ├── middleware/        # Auth middleware
│   ├── uploads/           # Uploaded images
│   └── server.js          # Entry point
│
├── rakshak-ai/            # Python Flask AI service
│   └── app.py             # Face recognition service
│
├── rakshak-frontend/      # React.js frontend
│   ├── src/
│   │   ├── components/    # React components
│   │   ├── pages/         # Page components
│   │   ├── App.jsx        # Main app
│   │   └── index.css      # Styles
│   └── package.json
│
└── SPEC.md                # Project specification
```

## 🔌 API Endpoints

### Authentication
- `POST /api/auth/register` - Register new user
- `POST /api/auth/login` - Login user
- `GET /api/auth/me` - Get current user

### Cases
- `GET /api/cases` - Get all cases (with filters)
- `GET /api/cases/:id` - Get case details
- `POST /api/cases` - Create missing person report
- `PUT /api/cases/:id` - Update case
- `DELETE /api/cases/:id` - Delete case (admin)
- `PUT /api/cases/:id/status` - Update case status (admin)

### Sightings
- `POST /api/sightings` - Report a sighting
- `GET /api/sightings/case/:caseId` - Get sightings for a case

### AI
- `POST /api/ai/encode` - Encode a face
- `POST /api/ai/match` - Find face matches
- `POST /api/ai/encode-and-store/:caseId` - Encode and store face

## 🎨 Features Implemented

1. ✅ User authentication (JWT)
2. ✅ Report missing persons with images
3. ✅ Upload found person for face matching
4. ✅ AI-based face recognition
5. ✅ View all cases with filters
6. ✅ Interactive map view
7. ✅ Case detail pages
8. ✅ Report sightings
9. ✅ Admin dashboard
10. ✅ Responsive UI

## ⚠️ Important Notes

- Face recognition requires dlib which can be tricky to install on Windows
- For production, use proper image storage (AWS S3, Cloudinary)
- Add email notifications for matches
- Implement rate limiting for API endpoints

## 📞 Emergency Contacts
In case of emergency, contact local law enforcement immediately.