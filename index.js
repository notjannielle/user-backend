require('dotenv').config(); // Ensure this is at the top of your file
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const productRoutes = require('./routes/products');
const orderRoutes = require('./routes/orders');
const userRoutes = require('./routes/userRoutes'); // Import user routes
const announcementRoutes = require('./routes/announcementRoutes');
const imageRoutes = require('./routes/imageRoutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Use routes
app.use('/api/products', productRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/users', userRoutes); // Use user routes
// Import the announcement routes

// Use routes
app.use('/api/announcement', announcementRoutes);
const PORT = process.env.PORT || 5001;


app.use('/api/slider-images', imageRoutes); // Use the new image routes

// Connect to MongoDB using the URI from the environment variable
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  ssl: true, // Ensure SSL is enabled
  serverApi: {
    version: '1',
    strict: true,
    deprecationErrors: true,
  },
})
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });

// Error handling middleware (optional)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});
