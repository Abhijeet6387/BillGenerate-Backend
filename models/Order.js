const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  orderID: mongoose.Schema.Types.ObjectId,
  items: [
    {
      name: {
        type: String,
        required: true,
      },
      price: {
        type: Number,
        required: true,
      },
    },
  ],
  customerName: {
    type: String,
    required: true,
  },
  customerEmail: {
    type: String,
    required: true,
  },
  totalAmount: {
    type: Number,
    required: true,
  },
  tip: Number,
});

const Order = mongoose.model("Order", orderSchema);

module.exports = Order;
