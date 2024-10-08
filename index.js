require('dotenv').config(); // Ensure this is at the top of your file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/userRoutes'); // Import user routes

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); // Use user routes

const PORT = process.env.PORT || 5001;

// Connect to MongoDB using the URI from the environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Add this line if you continue facing SSL issues
  tls: true, // Add this line for TLS connection
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });