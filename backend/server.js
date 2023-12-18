const express = require('express');
const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const cors = require('cors');
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

// MongoDB Connection
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/auth';
mongoose.connect(mongoUri);

const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));
db.once('open', () => {
  console.log('Connected to MongoDB!');
});

const userSchema = new mongoose.Schema({
  username: String,
  email: String,
  password: String,
});

const User = mongoose.model('User', userSchema);

const resetTokenSchema = new mongoose.Schema({
  userId: String,
  token: String,
  createdAt: { type: Date, expires: '15m', default: Date.now },
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

// MongoDB Connection for Movie API
const uri = process.env.MONGODB_URI;
const apiKey = process.env.REACT_APP_API_KEY || '';

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

let movieCollection;

async function run() {
  try {
    await client.connect();
    await client.db('admin').command({ ping: 1 });
    console.log('Connected to MongoDB!');

    // Update the database and collection name based on your MongoDB setup
    movieCollection = client.db('MovieID').collection('RandomMovieID');
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error);
  }
}

// ... (rest of your code remains unchanged)
