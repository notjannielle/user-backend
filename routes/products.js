const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

// @route GET api/products
// @desc Get all products
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// @route POST api/products
// @desc Create new product
router.post('/', async (req, res) => {
  const product = new Product(req.body);
  try {
    const newProduct = await product.save();
    res.status(201).json(newProduct);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});


// @route POST api/products/check-variant-availability
// @desc Check if a product variant is available at a specific branch
router.post('/check-variant-availability', async (req, res) => {
  const { productId, branch, variant } = req.body;

  try {
    // Find the product by ID
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    // Check if the branch exists in the product's branches
    if (!product.branches || !product.branches[branch]) {
      return res.status(404).json({ message: 'Branch not found' });
    }

    // Check for the variant in the specified branch
    const branchVariants = product.branches[branch];
    const variantAvailable = branchVariants.some(v => v.name.trim().toLowerCase() === variant.trim().toLowerCase() && v.available);

    return res.json({ available: variantAvailable });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});


module.exports = router;
