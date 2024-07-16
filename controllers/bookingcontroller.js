const Booking = require('../model/bookingModel');
const cloudinary = require('cloudinary').v2;
const stripe = require('stripe')('your_stripe_secret_key'); // Replace with your actual Stripe secret key

cloudinary.config({
  CLOUD_NAME:'dysvdfmu0',
API_KEY:'357913155545756',
API_SECRET:'RS5pSfCpy0a3-6NQhCuQdkNE92M',
});

const createBooking = async (req, res) => {
  console.log('Request Body:', req.body); // Log the request body
  console.log('Files:', req.files); // Log the uploaded files

  // Trim the values to remove any leading/trailing spaces
  const address = req.body.address ? req.body.address.trim() : '';
  const departureDate = req.body.departureDate ? req.body.departureDate.trim() : '';
  const returnDate = req.body.returnDate ? req.body.returnDate.trim() : '';
  const total = req.body.total ? req.body.total.trim() : '';

  const file = req.files ? req.files.identityDocument : null;

  if (!file) {
    return res.status(400).send({ message: 'No file uploaded!' });
  }

  if (!paymentMethod) {
    return res.status(400).send({ message: 'Payment method is required!' });
  }

  try {
    // Upload the file to Cloudinary
    const result = await cloudinary.uploader.upload(file.tempFilePath, {
      folder: 'bookings',
    });



    const newBooking = new Booking({
      address,
      departureDate,
      returnDate,
      identityDocument: result.secure_url, // Store the URL from Cloudinary
      paymentMethod,
      total,
      paymentStatus: paymentMethod === 'Credit Card' ? 'Paid' : 'Pending',
    });

    await newBooking.save();
    res.status(201).send({ message: 'Booking successful!', booking: newBooking });
  } catch (error) {
    console.error('Booking error:', error); // Log the full error
    res.status(500).send({ message: 'Booking failed!', error: error.message });
  }
};

module.exports = { createBooking 
 
};
