// importing
const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./database/db");
const cors = require("cors");
// const multiparty = require('multiparty');
const multiparty = require("connect-multiparty");

// const multiparty=require('connect-multiparty');
// const multiparty=require('connect-multiparty');
// const multiparty=require('connect-multiparty');
const cloudinary = require("cloudinary");
const fileUpload = require("express-fileupload");

// Making express app
const app = express();

// dotenv config
dotenv.config();

// cors policy
const corsPolicy = {
  origin: true,
  credentials: true,
  optionSuccessStatus: 200,
};
app.use(cors(corsPolicy));
// app.use(multiparty());
app.use(multiparty());

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});

// mongodb connection
connectDB();
// app.use(fileUpload());

// Accepting json data
app.use(express.json());

// test route
app.get("/test", (req, res) => {
  res.send("Hello from express server");
});
// http://localhost:5000/test

// user routes
app.use("/api/user", require("./routes/userRoutes"));

// app.use("/api/user", require("./routes/orderRoute"));

// our actual routes
// http://localhost:5000/api/user/create
// http://localhost:5000/api/user/login

// CREATE A ROUTE FOR PRODUCTS
app.use("/api/product", require("./routes/productRoutes"));

//for not persist
// await storage.init();
//
// user routes
app.use("/api/admin", require("./routes/adminRoute"));
app.use("/api/admin", require("./routes/contactRoute"));
// // cart route
app.use("/api/cart", require("./routes/cartRoute"));
app.use("/api/ship", require("./routes/shippingRoute"));

app.use("/api/user", require("./routes/orderRoute"));

// defining port
const PORT = process.env.PORT;
// run the server
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;
