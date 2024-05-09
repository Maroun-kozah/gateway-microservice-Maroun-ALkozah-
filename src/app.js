const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const mongoose = require('mongoose');

// Import custom middleware
const auditLog = require('./middleware/auditLog');
const authenticate = require('./middleware/authenticate');

// Establish MongoDB Connection
const connectDatabase = () => {
  const uri = process.env.MONGO_URI; // Ensure your .env file contains MONGO_URI
  mongoose.connect(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log('MongoDB connected successfully.'))
  .catch(err => console.error('MongoDB connection error:', err));
};

const app = express();

// Connect to database before server starts
connectDatabase();

app.use(cors());
app.use(bodyParser.json());
app.use(auditLog); // Make sure this middleware is configured to save to MongoDB

// Dynamic route initialization
require('./routes/routes')(app, authenticate);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
