import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import Register from './pages/Register'
import ReportMissing from './pages/ReportMissing'
import UploadFound from './pages/UploadFound'
import Cases from './pages/Cases'
import CaseDetail from './pages/CaseDetail'
import Community from './pages/Community'
import About from './pages/About'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/report-missing" element={<ReportMissing />} />
        <Route path="/upload-found" element={<UploadFound />} />
        <Route path="/cases" element={<Cases />} />
        <Route path="/cases/:id" element={<CaseDetail />} />
        <Route path="/community" element={<Community />} />
        <Route path="/about" element={<About />} />
      </Routes>
    </Router>
  )
}

export default App