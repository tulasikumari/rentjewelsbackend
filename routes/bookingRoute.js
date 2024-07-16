// Require the express module
const express = require('express');

// Create a new Router instance
const router = express.Router();

// Define your route handlers

// POST /api/booking/book
router.post('/book', (req, res) => {
    const bookingData = req.body; 

    res.status(201).json({
        message: 'Booking created successfully',
        booking: bookingData  
    });
    console.log(bookingData);
});


// Export the router so it can be used by the main application
module.exports = router;
