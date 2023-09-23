const mongoose = require("mongoose");

const menuSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: String,
  price: {
    type: Number,
    required: true,
  },
  id: mongoose.Schema.Types.ObjectId,
});

const Menu = mongoose.model("Menu", menuSchema);

module.exports = Menu;
