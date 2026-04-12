# Rakshak - Women Safety & Missing Person Platform

A full-stack web application for women safety and missing person identification.

## Features

- 🏠 Modern Dashboard UI (SafeFind)
- 👤 User Authentication (Login/Signup)
- 📋 Report Missing Persons with Images
- 📸 Face Detection (AI-powered matching - demo mode)
- 🗺️ View Cases on Map
- 🔍 Search and Filter Cases
- 👥 Community Hub with Location Detection
- 📱 Mobile Responsive Design

## Tech Stack

- **Frontend**: React.js + Vite
- **Backend**: Node.js + Express
- **Database**: MongoDB (Atlas)
- **AI**: Python Flask (demo mode)

## Project Structure

```
rakshak/
├── safefind-frontend/     # Main React frontend
├── rakshak-backend/      # Node.js API server
├── rakshak-ai/           # Python AI service
├── README.md
└── SPEC.md
```

## How to Run

### 1. Frontend
```bash
cd safefind-frontend
npm install
npm run dev
```

### 2. Backend
```bash
cd rakshak-backend
npm install
# Update .env with your MongoDB connection string
npm start
```

### 3. AI Service (Optional - Demo Mode)
```bash
cd rakshak-ai
pip install -r requirements.txt
python app.py
```

## MongoDB Setup

Update `rakshak-backend/.env` with your MongoDB Atlas connection string:
```
MONGO_URI=mongodb+srv://<username>:<password>@cluster0.xxx.mongodb.net/rakshak
```

## Live Demo

The frontend is running at: http://localhost:3000

## Features Demo

- **Face Detection**: Shows mock results (real AI requires face_recognition library)
- **Location Detection**: Uses browser Geolocation API
- **Reports**: Saved to MongoDB database

## License

MIT