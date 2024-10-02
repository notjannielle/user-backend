const mongoose = require('mongoose');
const dotenv = require('dotenv');
const Product = require('./models/Product');

dotenv.config();

const products = [
  {
    name: "Product 1",
    category: "Fruits",
    image: "https://via.placeholder.com/150",
    price: 10,
    branches: {
      main: [
        { name: "Variant 1", available: true },
        { name: "Variant 2", available: false },
        { name: "Variant 3", available: true },
      ],
      second: [
        { name: "Variant 1", available: true },
        { name: "Variant 2", available: true },
        { name: "Variant 3", available: false },
      ],
      third: [
        { name: "Variant 1", available: false },
        { name: "Variant 2", available: true },
        { name: "Variant 3", available: true },
      ],
    },
  },
  {
    name: "Product 2",
    category: "Vegetables",
    image: "https://via.placeholder.com/150",
    price: 20,
    branches: {
      main: [
        { name: "Variant 1", available: false },
        { name: "Variant 2", available: false },
        { name: "Variant 3", available: false },
      ],
      second: [
        { name: "Variant 1", available: false },
        { name: "Variant 2", available: true },
        { name: "Variant 3", available: true },
      ],
      third: [
        { name: "Variant 1", available: false },
        { name: "Variant 2", available: false },
        { name: "Variant 3", available: true },
      ],
    },
  },
  // Add more products as needed
];

const seedDB = async () => {
  await mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
  await Product.deleteMany({});
  await Product.insertMany(products);
  console.log('Database seeded!');
  mongoose.connection.close();
};

seedDB();
