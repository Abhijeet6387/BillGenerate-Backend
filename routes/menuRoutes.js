const express = require("express");
const router = express.Router();
const Menu = require("../models/Menu");

// Route to create new menu item
router.post("/create-menu", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }
    const newItem = new Menu({ name, price, description });
    await newItem.save();
    res.status(201).json(newItem);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error creating menu item" });
  }
});

// Route to fetch all menu items
router.get("/allmenu", async (req, res) => {
  try {
    const menuItems = await Menu.find().sort({ price: 1 });
    res.json(menuItems);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

// Route to fetch a menu item
router.get("/allmenu/:id", async (req, res) => {
  try {
    const itemId = req.params.id;
    const menuItem = await Menu.findById(itemId);
    res.json(menuItem);
  } catch (error) {
    res.status(500).json({ error: "Error fetching menu items" });
  }
});

// Route to update a menu item by ID
router.put("/allmenu/:id/update", async (req, res) => {
  try {
    const { name, price, description } = req.body;
    const itemId = req.params.id;

    if (!name || !price) {
      return res.status(400).json({ error: "Name and price are required" });
    }

    const updatedItem = await Menu.findByIdAndUpdate(
      itemId,
      { name, price, description },
      { new: true }
    );

    if (!updatedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json(updatedItem);
  } catch (error) {
    res.status(500).json({ error: "Error updating menu item" });
  }
});

// Route to delete a menu item by ID
router.delete("/allmenu/:id/delete", async (req, res) => {
  try {
    const itemId = req.params.id;
    const deletedItem = await Menu.findByIdAndDelete(itemId);
    if (!deletedItem) {
      return res.status(404).json({ error: "Menu item not found" });
    }
    res.json({ message: "Menu item deleted" });
  } catch (error) {
    res.status(500).json({ error: "Error deleting menu item" });
  }
});

module.exports = router;
