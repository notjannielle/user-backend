const express = require('express');
const router = express.Router();
const Order = require('../models/Order');

// POST: Create a new order
router.post('/', async (req, res) => {
  const orderData = req.body;

  try {
    const newOrder = new Order({ ...orderData, status: 'Order Received' }); // Default status
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (error) {
    console.error("Error creating order:", error);
    res.status(500).json({ message: 'Failed to create order', error: error.message });
  }
});

// GET: Fetch order details by order number
router.get('/:orderNumber', async (req, res) => {
  const { orderNumber } = req.params;

  try {
    const order = await Order.findOne({ orderNumber });
    if (!order) {
      return res.status(404).json({ message: 'Order not found' });
    }
    res.status(200).json(order);
  } catch (error) {
    console.error("Error fetching order:", error);
    res.status(500).json({ message: 'Failed to fetch order', error: error.message });
  }
});

// PATCH: Update order status
router.patch('/:orderNumber/status', async (req, res) => {
  const { orderNumber } = req.params;
  const { status } = req.body;

  // Validate that status is provided
  if (!status) {
    return res.status(400).json({ message: 'Status is required' });
  }

  // Optional: Validate status against allowed values
  const allowedStatuses = ['Order Received', 'Preparing', 'Ready for Pickup', 'Picked Up', 'Canceled'];
  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({ message: 'Invalid status' });
  }

  try {
    const updatedOrder = await Order.findOneAndUpdate(
      { orderNumber },
      { status },
      { new: true } // Return the updated document
    );

    if (!updatedOrder) {
      return res.status(404).json({ message: 'Order not found' });
    }

    res.json(updatedOrder);
  } catch (error) {
    console.error("Error updating order status:", error);
    res.status(500).json({ message: 'Failed to update order status', error: error.message });
  }
});



// GET: Fetch orders by user contact number
router.get('/user/:contact', async (req, res) => {
  const { contact } = req.params;

  try {
    const orders = await Order.find({ 'user.contact': contact });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ message: 'No orders found for this user' });
    }
    res.status(200).json(orders);
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ message: 'Failed to fetch orders', error: error.message });
  }
});

module.exports = router;
