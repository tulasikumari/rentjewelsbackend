// const express = require('express');
// const fileUpload = require('express-fileupload');
// const mongoose = require('mongoose');
// const app = express();

// // Middleware to parse JSON and URL-encoded data
// app.use(express.json());
// app.use(express.urlencoded({ extended: true }));
// // Middleware to handle file uploads
// app.use(fileUpload({ createParentPath: true }));

// // Database connection (replace with your actual connection string)
// mongoose.connect('your_connection_string', {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
// });

// mongoose.connection.on('connected', () => {
//   console.log('Connected to MongoDB');
// });

// mongoose.connection.on('error', (err) => {
//   console.log('Error connecting to MongoDB:', err);
// });

// // Route configuration
// const { createBooking } = require('./controllers/bookingController');
// app.post('/api/booking/book', createBooking);

// const PORT = process.env.PORT || 5000;
// app.listen(PORT, () => {
//   console.log(`Server is running on port ${PORT}`);
// });
