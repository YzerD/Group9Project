
// server.js
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
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/react-auth';
mongoose.connect(mongoUri, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
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
  createdAt: { type: Date, expires: 900, default: Date.now }, // Token expires in 15 minutes
});

const ResetToken = mongoose.model('ResetToken', resetTokenSchema);

// MongoDB Connection for Movie API
const uri = process.env.MONGODB_URI_MOVIE;
const apiKey = process.env.REACT_APP_API_KEY || '';

let movieCollection;

const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

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

// Signup Route
app.post('/signup', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
app.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (passwordMatch) {
      res.status(200).json({ message: 'Login successful' });
    } else {
      res.status(401).json({ message: 'Invalid credentials' });
    }
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Forgot Password Route
app.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const resetToken = crypto.randomBytes(20).toString('hex');
    const newResetToken = new ResetToken({ userId: user._id, token: resetToken });
    await newResetToken.save();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'your-email@gmail.com',
        pass: 'your-email-password',
      },
    });

    const mailOptions = {
      from: 'your-email@gmail.com',
      to: user.email,
      subject: 'Password Reset',
      text: `Use the following link to reset your password: http://localhost:3000/reset-password/${resetToken}`,
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.error(error);
        res.status(500).json({ message: 'Error sending email' });
      } else {
        console.log('Email sent: ' + info.response);
        res.status(200).json({ message: 'Password reset token sent successfully' });
      }
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Random Movie Route with Default Parameters
app.post('/random/default', async (req, res) => {
  try {
    // Default parameters for fetching random movies
    const defaultParams = {
      sort_by: 'popularity.desc',
      vote_average: '5',
      runtime: '120',
    };

    const externalApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${new URLSearchParams(defaultParams)}`;
    const response = await fetch(externalApiUrl);

    if (!response.ok) {
      throw new Error('Error in response');
    }

    const movies = await response.json();

    // Select a random movie from the

 list
    const randomMovie = movies.results[Math.floor(Math.random() * movies.results.length)];

    res.json({
      data: {
        randomMovie: {
          title: randomMovie.title,
          genres: randomMovie.genre_ids,
          releaseDate: randomMovie.release_date,
          overview: randomMovie.overview,
          // Include additional information as needed
          // Add any other properties you want to include
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch random movie with default parameters' });
  }
});

// Random Movie Route with Selected Parameters
app.post('/random/selected', async (req, res) => {
  try {
    const { genres, decades, rating, runtime } = req.body;

    // Validate request parameters
    if (!genres || !decades || !rating || !runtime) {
      throw new Error('Invalid request parameters');
    }

    // Construct the API request parameters
    const selectedParams = {
      with_genres: genres.join('|'),
      primary_release_date: decades.join('|'),
      vote_average: `0,${rating}`,
      with_runtime: `${runtime},${runtime}`,
    };

    const externalApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${new URLSearchParams(selectedParams)}`;
    const response = await fetch(externalApiUrl);

    if (!response.ok) {
      throw new Error('Error in response');
    }

    const movies = await response.json();

    if (movies.results.length === 0) {
      throw new Error('No matching movies found');
    }

    // Select a random movie from the list
    const randomMovie = movies.results[Math.floor(Math.random() * movies.results.length)];

    res.json({
      data: {
        randomMovie: {
          title: randomMovie.title,
          genres: randomMovie.genre_ids,
          releaseDate: randomMovie.release_date,
          overview: randomMovie.overview,
        },
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to fetch random movie with selected parameters' });
  }
});

// Connect to MongoDB when the server starts
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
