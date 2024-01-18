const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');
const { Schema, model } = mongoose;
const bcrypt = require('bcrypt'); // You need to install this package
const jwt = require('jsonwebtoken'); // You need to install this package

const app = express();
const PORT = 4000;


app.use(cors({ credentials: true, origin: 'http://localhost:3000' }));
app.use(express.json());
require('./conn');
require('dotenv').config();
// Define MongoDB models for each collection

const User = new Schema({
  username: {
    type: String,
    required: true,
    unique: true, // Ensure unique usernames
  },
  password: String,
});

const UserModel = model('user', User);

// const hashedPassword = bcrypt.hashSync('user_password', saltRounds);
// const newUser = new UserModel({
//    username: 'user',
//   password: hashedPassword });

// await newUser.save();

const PersonalDetails = new Schema({
  name: String,
  age: Number,
});
const PersonalDetailsModel = model('personalDetail', PersonalDetails);

const AadhaarCards = new Schema({
  name: String,
  age: Number,
  aadhaarCardNumber: String,
  livestockValue: Number,
});
const AadhaarCardModel = model('aadhaarcard', AadhaarCards);

const PanCard = new Schema({
  name: String,
  age: Number,
  panCardNumber: String,
  annualIncome: Number,
  annualExpenditure: Number,
  netCashFlow: Number,
  taxPaymentsDue: Number,
  lateTaxPayments: Number,
  taxPaymentViolations: Number,
  investments: Number,
});
const PanCardModel = model('pancard', PanCard);

const Collateral = new Schema({
  name: String,
  age: Number,
  landValue: Number,
  equipValue: Number,
  propertyValue: Number,
  inventoryValue: Number,
});
const CollateralModel = model('collateral', Collateral);

app.post('/', async (req, res) => {
  try {
    const {
      name,
      age,
      panCardNumber,
      aadhaarCardNumber,
      propertyValue,
      equipValue,
      inventoryValue,
      landValue,
    } = req.body;

    // Create a PersonalDetails entry
    const personalDetailsEntry = await PersonalDetailsModel.create({
      name,
      age,
    });

    // Create a Collateral entry
    const collateralEntry = await CollateralModel.create({
      name,
      age,
      landValue,
      equipValue,
      propertyValue,
      inventoryValue,
    });

    // You can modify the response data based on your requirements
    res.status(200).json({
      message: 'Form data submitted successfully.',
      personalDetails: personalDetailsEntry,
      collateral: collateralEntry,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-aadhaar-data/:aadhaarCardNumber', async (req, res) => {
  try {
    const { aadhaarCardNumber } = req.params;

    // Fetch Aadhaar Card data based on the aadhaarCardNumber parameter
    const aadhaarData = await AadhaarCardModel.findOne({
      aadhaarCardNumber,
    });

    if (!aadhaarData) {
      return res.status(404).json({ message: 'Aadhaar Card data not found' });
    }

    // Send the data back in the response
    res.status(200).json(aadhaarData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

app.get('/get-pan-data/:panCardNumber', async (req, res) => {
  try {
    const { panCardNumber } = req.params;

    // Fetch Pan Card data based on the panCardNumber parameter
    const panData = await PanCardModel.findOne({
      panCardNumber,
    });

    if (!panData) {
      return res.status(404).json({ message: 'Pan Card data not found' });
    }

    // Send the data back in the response
    res.status(200).json(panData);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});



// app.post('/login', async (req, res) => {
//   try {
//     const { username, password } = req.body;

//     // Check if the user exists
//     const userDoc = await UserModel.findOne({ username });

//     if (!userDoc) {
//       return res.status(401).json({ message: 'Invalid credentials user is not found' });
//     }

//     // Compare the password using bcrypt
//     const passOk = bcrypt.compareSync(password, userDoc.password);

//     if (passOk) {
//       // Respond with user information (excluding sensitive data)
//       res.status(200).json({
//         id: userDoc._id,
//         username,
//         message: 'Login successful',
//       });
//     } else {
//       res.status(401).json({ message: 'Invalid credentials, password is incorrect' });
//     }
//   } catch (error) {
//     res.status(500).json({ error: error.message });
//   }
// });

app.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    const userDoc = await UserModel.findOne({ username });

    if (!userDoc) {
      return res.status(401).json({ message: 'Invalid credentials: User not found' });
    }

    // For simplicity, compare passwords without hashing (not recommended for production)
    if (password === userDoc.password) {
      res.status(200).json({
        id: userDoc._id,
        username,
        message: 'Login successful',
      });
    } else {
      console.log('Incorrect Password:', password);
      console.log('Stored Password in Database:', userDoc.password);
      res.status(401).json({ message: 'Invalid credentials: Incorrect password' });
    }
  } catch (error) {
    console.error('Login Error:', error.message);
    res.status(500).json({ error: error.message });
  }
});

app.get('/testNode', (req, res) => {
  res.status(200).send('Yes the testNode endpoint worked');
});

// Your existing routes...

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

module.exports = app;