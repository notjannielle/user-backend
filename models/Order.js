const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
  user: {
    name: { type: String, required: true },
    contact: { type: String, required: true },
  },
  branch: { type: String, required: true },
  items: [{
    product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    variant: { type: String, required: true },
    quantity: { type: Number, required: true },
    price: { type: Number, required: true },
    branch: { type: String, required: true },
  }],
  total: { type: Number, required: true },
  orderNumber: { type: String, required: true },
  status: {
    type: String,
    enum: ['Order Received', 'Preparing', 'Ready for Pickup', 'Picked Up', 'Canceled'],
    default: 'Order Received',
  },
  paymentMethod: { type: String, enum: ['cash', 'gcash'], required: true }, // New field for payment method
});

// Middleware to validate that all items belong to the same branch
orderSchema.pre('validate', function(next) {
  if (this.items.length > 0) {
    const firstBranch = this.items[0].branch;
    const allSameBranch = this.items.every(item => item.branch === firstBranch);
    
    if (!allSameBranch) {
      return next(new Error('All items must belong to the same branch.'));
    }

    this.branch = firstBranch;
  }
  next();
});

const Order = mongoose.model('Order', orderSchema);

module.exports = Order;
