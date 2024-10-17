require('dotenv').config();
const express = require('express');
const cors = require('cors');
const admin = require('firebase-admin');
const otpService = require('./otpService');



const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3000;

// Firebase initialization
const serviceAccount = require('./firebase-key.json'); // Ganti dengan path ke service account JSON

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: process.env.FIREBASE_DATABASE_URL,
});

// Rute GET untuk root
app.get('/', (req, res) => {
  res.send('Welcome to the OTP Verification Service!');
});

// Routes
app.post('/send-otp', otpService.sendOTP);
app.post('/verify-otp', otpService.verifyOTP);

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
