# Rakshak - Women Safety & Missing Person Identification Platform

## Project Overview

**Project Name:** Rakshak  
**Type:** Full-stack Web Application  
**Core Functionality:** A platform for reporting missing persons and matching found individuals using AI-based face recognition  
**Target Users:** Families of missing persons, general public, law enforcement, admins

---

## Tech Stack

### Frontend
- React.js 18 with Vite
- React Router v6
- Axios for API calls
- Leaflet for maps
- CSS Modules with custom styling

### Backend
- Node.js with Express
- MongoDB with Mongoose
- JWT Authentication
- Multer for file uploads

### AI Service
- Python with face_recognition library
- Flask for API endpoints

---

## UI/UX Specification

### Color Palette
- **Primary:** #E63946 (Crimson Red - urgency, safety)
- **Secondary:** #1D3557 (Deep Navy - trust, security)
- **Accent:** #F4A261 (Warm Orange - hope)
- **Background:** #F8F9FA (Light Gray)
- **Surface:** #FFFFFF (White)
- **Text Primary:** #212529
- **Text Secondary:** #6C757D
- **Success:** #2A9D8F
- **Warning:** #E9C46A
- **Danger:** #E63946

### Typography
- **Font Family:** 'Poppins' for headings, 'Inter' for body
- **Headings:** 
  - H1: 2.5rem, weight 700
  - H2: 2rem, weight 600
  - H3: 1.5rem, weight 600
- **Body:** 1rem, weight 400

### Layout
- Max container width: 1200px
- Navbar height: 70px
- Card border-radius: 12px
- Box shadow: 0 4px 20px rgba(0,0,0,0.08)

### Responsive Breakpoints
- Mobile: < 768px
- Tablet: 768px - 1024px
- Desktop: > 1024px

---

## Pages & Components

### 1. Home Page
- Hero section with tagline "Protecting Lives, Reuniting Families"
- Three main action buttons (Report Missing, Upload Found, View Cases)
- Recent cases carousel (6 cards)
- Statistics counter (missing persons found, active cases)
- Emergency contact section

### 2. Navigation Bar
- Logo "Rakshak" with shield icon
- Nav links: Home, Cases, Report, About
- Auth buttons or user profile dropdown
- Sticky on scroll

### 3. Report Missing Person Page
- Multi-step form or single page form
- Fields: Full Name, Age, Gender, Last Seen Location (map picker), Date Missing, Description, Multiple Images
- Image upload with drag-drop
- Map for location selection
- Submit button with loading state

### 4. Upload Found Person Page
- Single image upload
- Optional location and description
- "Find Matches" button triggering AI comparison
- Results display with match percentages

### 5. View Cases Page
- Filter sidebar (Age range, Gender, Location)
- Grid of case cards (3 columns desktop, 2 tablet, 1 mobile)
- Case card: Image, Name, Age, Location, Date missing
- Pagination
- Sort options (Recent, Urgent)

### 6. Map View Page
- Full-screen Leaflet map
- Markers for all missing persons
- Popup with case summary on marker click
- Cluster markers for dense areas

### 7. Case Detail Page
- Large image gallery (main + thumbnails)
- Full details panel
- Status badge (Active/Found/Closed)
- Reported sightings section
- "Report Sighting" button opens modal
- Social share buttons

### 8. Auth Pages (Login/Register)
- Clean form design
- Role selection (User/Admin) on register
- Social login placeholders
- Password strength indicator

### 9. Admin Dashboard
- Statistics overview cards
- Cases table with status
- Approve/Reject actions
- Delete case option
- User management tab

---

## Functionality Specification

### Authentication
- JWT-based auth
- Tokens stored in localStorage
- Auto-refresh on expiry
- Role-based access control

### Image Handling
- Multer for file uploads
- Store in /uploads folder
- Generate thumbnails
- Validate image types (jpg, png, webp)
- Max file size: 5MB

### Face Recognition
- Python microservice with Flask
- face_recognition library for encoding
- Store 128-d face encodings in MongoDB
- Compare with Euclidean distance
- Threshold: 0.6 (60% match)
- Return similarity percentage (100 - distance * 100)

### Database Schema

#### User Model
```
{
  username: String,
  email: String,
  password: String (hashed),
  role: Enum ['user', 'admin'],
  createdAt: Date
}
```

#### MissingPerson Model
```
{
  fullName: String,
  age: Number,
  gender: Enum ['Male', 'Female', 'Other'],
  lastSeenLocation: {
    type: String,
    coordinates: [Number], // [lng, lat]
    address: String
  },
  dateMissing: Date,
  description: String,
  images: [String], // file paths
  faceEncoding: [Number], // 128-d array
  status: Enum ['Active', 'Found', 'Closed'],
  reportedBy: ObjectId (User),
  createdAt: Date
}
```

#### Sighting Model
```
{
  caseId: ObjectId (MissingPerson),
  image: String,
  location: String,
  description: String,
  reportedBy: ObjectId (User),
  createdAt: Date
}
```

### API Endpoints

#### Auth
- POST /api/auth/register
- POST /api/auth/login
- GET /api/auth/me

#### Cases
- GET /api/cases (with filters)
- GET /api/cases/:id
- POST /api/cases (auth required)
- PUT /api/cases/:id (owner/admin)
- DELETE /api/cases/:id (admin)

#### Sightings
- POST /api/sightings (auth required)
- GET /api/sightings/:caseId

#### AI Service
- POST /api/ai/match - Send image, get matches
- POST /api/ai/encode - Encode uploaded image

---

## Acceptance Criteria

1. ✅ Home page loads with navigation and action buttons
2. ✅ User can register and login
3. ✅ Missing person form submits and stores in DB
4. ✅ Found person upload triggers face matching
5. ✅ Face matching returns similarity percentage
6. ✅ Cases page displays all missing persons with filters
7. ✅ Map shows all case locations
8. ✅ Case detail page shows full information
9. ✅ Sighting can be reported on case page
10. ✅ Admin can manage all cases
11. ✅ Responsive on mobile and desktop
12. ✅ Clean, modern UI with specified colors