const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const path = require("path");
const app = express();
require("dotenv").config();

const menuRoutes = require("./routes/menuRoutes");
const orderRoutes = require("./routes/orderRoutes");
const dbString = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.qfdmpt7.mongodb.net/?retryWrites=true&w=majority`;
const port = process.env.PORT || 5000;

app.use(express.json());

mongoose
  .connect(dbString, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.log(err));

app.get("/", (req, res) => {
  res.send("Welcome Home");
});
app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

// Serve the React app
// app.use(express.static(path.join(__dirname, "../client/build")));
// app.get("*", (req, res) => {
//   res.sendFile(path.join(__dirname, "../client/build", "index.html"));
// });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
