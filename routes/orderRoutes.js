const express = require("express");
const router = express.Router();
const Order = require("../models/Order");
const crypto = require("crypto");

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
router.get("/allorders/customer", async (req, res) => {
  try {
    const customerEmail = req.query.email;
    if (!customerEmail) {
      return res.status(400).json({ error: "Email is required" });
    }
    if (customerEmail === "all") {
      const allOrders = await Order.find();
      return res.json(allOrders);
    }

    const orders = await Order.find({ customerEmail });
    if (!orders || orders.length === 0) {
      return res.status(404).json({ error: "Orders not found" });
    }
    res.json(orders);
  } catch (error) {
    res.status(500).json({ error: "Error fetching orders" });
  }
});

function generateUniqueBillNumber(orderIds) {
  const combinedOrderIds = orderIds.join("");
  const uniqueCode = crypto
    .createHash("sha256")
    .update(combinedOrderIds)
    .digest("hex");

  return uniqueCode;
}

// Route to get all user details and bill details by email
router.get("/get-bill", async (req, res) => {
  try {
    const userEmail = req.query.email;
    if (!userEmail) {
      return res.status(400).json({ error: "Email parameter is missing" });
    }
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

    const orderIds = userOrders.map((order) => order._id.toString());
    const billNo = generateUniqueBillNumber(orderIds);

    const response = {
      billNo,
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
