const express = require("express");
const cors = require("cors");
const menuRoutes = require("./routes/menu.routes");
const orderRoutes = require("./routes/order.routes");
const errorHandler = require("./middlewares/error.middleware");

const app = express();

app.use(
  cors({
    origin: "*", 
    credentials: true,
  })
);
app.use(express.json());

app.use("/api/menu", menuRoutes);
app.use("/api/orders", orderRoutes);

app.use(errorHandler);

module.exports = app;
