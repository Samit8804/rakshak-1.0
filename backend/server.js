require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(express.json({ extended: false }));
app.use(cors({ origin: 'http://localhost:3000', credentials: false }));

const PORT = process.env.PORT || 5000;

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1);
  }
};

connectDB();

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/report', require('./routes/report'));

// Export app for testing or external usage
module.exports = app;

// Start server only if run directly (not when required in tests)
if (require.main === module) {
  app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
