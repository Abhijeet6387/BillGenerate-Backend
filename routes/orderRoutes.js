const express = require("express");
const router = express.Router();
const Order = require("../models/Order");

// Route to create a new order
router.post("/create-order", async (req, res) => {
  try {
    const { items, customerName, customerEmail, totalAmount, tip } = req.body;
    if (!items || !customerName || !customerEmail || !totalAmount) {
      return res.status(400).json({ error: "Some fields are empty" });
    }
    const newOrder = new Order({
      items,
      customerName,
      customerEmail,
      totalAmount,
      tip,
    });
    await newOrder.save();
    res.status(201).json({ message: "New order created", details: newOrder });
  } catch (error) {
    res.status(500).json({ error: "Error creating order" });
  }
});

// Route to fetch all orders
router.get("/allorders", async (req, res) => {
  try {
    const orders = await Order.find();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

// Route to fetch a specific order by ID
router.get("/allorders/:id", async (req, res) => {
  try {
    const orderId = req.params.id;
    const order = await Order.findById(orderId);
    if (!order) {
      return res.status(404).json({ error: "Order not found" });
    }
    res.json(order);
  } catch (error) {
    res.status(500).json({ error: "Error fetching order" });
  }
});

// Route to get all user details and bill details by email
router.get("/get-bill", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }
    // Find all orders with the given email
    const userOrders = await Order.find({ customerEmail: userEmail });
    if (userOrders.length === 0) {
      return res.status(404).json({ error: "No orders found for this email" });
    }

    let amountToBePaid = 0;
    userOrders.forEach((order) => {
      amountToBePaid += order.totalAmount + order.tip;
    });

    const userDetails = {
      name: userOrders[0].customerName,
      email: userEmail,
    };

    const response = {
      userDetails,
      amountToBePaid,
      orders: userOrders,
    };
    res.json(response);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Error fetching user details and bill details" });
  }
});

module.exports = router;
