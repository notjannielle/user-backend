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

mongoose.connect('mongodb+srv://escobar:@escobar4256@escobarvapecartel.snbyobo.mongodb.net/?retryWrites=true&w=majority&appName=escobarvapecartel', { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("Database connection error:", error);
  });
