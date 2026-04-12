const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const casesDir = path.join(__dirname, 'uploads/cases');
const sightingsDir = path.join(__dirname, 'uploads/sightings');
if (!fs.existsSync(casesDir)) fs.mkdirSync(casesDir, { recursive: true });
if (!fs.existsSync(sightingsDir)) fs.mkdirSync(sightingsDir, { recursive: true });

mongoose.connect(process.env.MONGO_URI || 'mongodb://localhost:27017/rakshak', {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB Connected')).catch(err => console.log(err));

const authRoutes = require('./routes/auth');
const caseRoutes = require('./routes/cases');
const sightingRoutes = require('./routes/sightings');
const aiRoutes = require('./routes/ai');

app.use('/api/auth', authRoutes);
app.use('/api/cases', caseRoutes);
app.use('/api/sightings', sightingRoutes);
app.use('/api/ai', aiRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Rakshak API is running' });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));