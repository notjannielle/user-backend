// src/routes/userRoutes.js
const express = require('express');
const User = require('../models/User');
const bcrypt = require('bcrypt');
const twilio = require('twilio');
const crypto = require('crypto'); // Importing crypto
const jwt = require('jsonwebtoken'); // Import jsonwebtoken
const router = express.Router();

const accountSid = 'ACe80f6db60b10cc0ec639bcaffe8037e2';
const authToken = '2032af363da105eb1abd00c28643b5ea';
const client = new twilio(accountSid, authToken);
const TWILIO_PHONE_NUMBER = '+15483259223';

function generateOtp() {
    return Math.floor(100000 + Math.random() * 900000).toString(); // Generates a 6-digit OTP
}

const saltRounds = 10; // You can adjust this

// Registration endpoint
router.post('/register', async (req, res) => {
    const { fullName, phoneNumber, password } = req.body;

    const formattedPhoneNumber = phoneNumber.startsWith('09')
        ? `+63${phoneNumber.slice(1)}`
        : phoneNumber;

    try {
        const hashedPassword = await bcrypt.hash(password, saltRounds);
        const otp = generateOtp();
        const otpExpires = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes from now

        const user = new User({ fullName, phoneNumber: formattedPhoneNumber, password: hashedPassword, otp, otpExpires });
        await user.save();

        // Uncomment this line to send the SMS if needed
        // await client.messages.create({
        //     body: `Your OTP code is ${otp}`,
        //     from: TWILIO_PHONE_NUMBER,
        //     to: formattedPhoneNumber,
        // });


        res.status(201).json({ message: 'Registration successful. OTP sent.' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).json({ message: 'Error during registration. Existing account with same mobile number.' });
    }
});

// OTP verification endpoint
router.post('/verify-otp', async (req, res) => {
    const { phoneNumber, otp } = req.body;

    // Ensure the phone number is in the correct format
    const formattedPhoneNumber = phoneNumber.startsWith('09')
        ? `+63${phoneNumber.slice(1)}`
        : phoneNumber;

    try {
        const user = await User.findOne({ phoneNumber: formattedPhoneNumber });
        if (!user) {
            return res.status(400).json({ message: 'User not found.' });
        }

        if (user.otp !== otp || user.otpExpires < Date.now()) {
            return res.status(400).json({ message: 'Invalid or expired OTP.' });
        }

        user.isVerified = true;
        user.otp = undefined;
        user.otpExpires = undefined;
        await user.save();

        res.status(200).json({ message: 'OTP verified successfully.' });
    } catch (error) {
        console.error('Error verifying OTP:', error);
        res.status(500).json({ message: 'Error verifying OTP.' });
    }
});

// Resend OTP endpoint
router.post('/resend-otp', async (req, res) => {
    const { phoneNumber } = req.body;

    // Ensure the phone number is in the correct format
    const formattedPhoneNumber = phoneNumber.startsWith('09')
        ? `+63${phoneNumber.slice(1)}`
        : phoneNumber;

    console.log('Formatted phone number:', formattedPhoneNumber); // Add this line for debugging


    try {
        const user = await User.findOne({ phoneNumber: formattedPhoneNumber });

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        const otp = generateOtp(); // Generate a new OTP
        user.otp = otp; // Update the user's OTP
        user.otpExpires = new Date(Date.now() + 10 * 60 * 1000); // Update OTP expiration time
        await user.save();

        await client.messages.create({
            body: `Your verification code is ${otp}`,
            from: TWILIO_PHONE_NUMBER,
            to: formattedPhoneNumber,
        });
        console.log('Message sent:', message); // Log successful message

        res.json({ message: 'OTP resent successfully' });
    } catch (error) {
        console.error('Error sending SMS:', error); // Log the error
        res.status(500).json({ message: 'Error during OTP resend' });
    }
});

// Login endpoint
router.post('/login', async (req, res) => {
    const { phoneNumber, password } = req.body;

    // Convert to international format for lookup
    const formattedPhoneNumber = phoneNumber.startsWith('09')
        ? `+63${phoneNumber.slice(1)}`
        : phoneNumber;

    try {
        const user = await User.findOne({ phoneNumber: formattedPhoneNumber });

        if (!user) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        if (!user.isVerified) {
            return res.json({ isVerified: false, message: 'Account is not activated. An OTP has been sent to your phone.' });
        }

        // Generate JWT token after successful login
        const token = jwt.sign({ id: user._id }, 'escobar', { expiresIn: '90d' }); // Add your secret key here

        // Include user data in the response
        res.json({
            isVerified: true,
            message: 'Login successful',
            token,
            user: { // Add this part to include user data
                fullName: user.fullName,
                phoneNumber: user.phoneNumber,
            },
        });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(500).json({ message: 'Error during login' });
    }
});


// Add this endpoint in your userRoutes.js
router.get('/otp/:phoneNumber', async (req, res) => {
    const formattedPhoneNumber = req.params.phoneNumber.startsWith('09')
      ? `+63${req.params.phoneNumber.slice(1)}`
      : req.params.phoneNumber;
  
    try {
      const user = await User.findOne({ phoneNumber: formattedPhoneNumber });
  
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
  
      res.json({ otp: user.otp });
    } catch (error) {
      console.error('Error retrieving OTP:', error);
      res.status(500).json({ message: 'Error retrieving OTP' });
    }
  });
  





// Get current user profile endpoint
// Get current user profile endpoint
router.get('/profile', async (req, res) => {
    const token = req.headers['authorization'];

    if (!token) {
        return res.status(401).json({ message: 'No token provided.' });
    }

    try {
        // Log the token for debugging
        console.log('Authorization token received:', token);
        
        const decoded = jwt.verify(token.split(' ')[1], 'escobar'); // Ensure your secret matches here
        console.log('Decoded JWT:', decoded); // Log the decoded token for debugging

        const user = await User.findById(decoded.id).select('-password -__v'); // Exclude password and version

        if (!user) {
            return res.status(404).json({ message: 'User not found.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Error retrieving user profile:', error);
        res.status(500).json({ message: 'Error retrieving user profile.', error: error.message }); // Send back the error message for debugging
    }
});


module.exports = router;