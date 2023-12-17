const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const fetch = require('node-fetch');
require('dotenv').config();

const app = express();
const port = process.env.PORT || 5000;

const uri = process.env.MONGODB_URI;
const apiKey = process.env.REACT_APP_API_KEY || '';
app.use(cors());
app.use(express.json()); // Parse JSON request bodies

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
    await client.db("admin").command({ ping: 1 });
    console.log("Connected to MongoDB!");

    // Update the database and collection name based on your MongoDB setup
    movieCollection = client.db("MovieID").collection("RandomMovieID");
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
  }
}

// This route will handle the random movie request with default values
app.post('/random/default', async (req, res) => {
  try {
    // You can customize these default parameters based on your requirements
    const defaultParams = {
      sort_by: 'popularity.desc',
      vote_average: '5',
      runtime: '120',
    };

    const externalApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${new URLSearchParams(defaultParams)}`;
    const response = await fetch(externalApiUrl);

    if (!response.ok) {
      throw new Error("Error in response");
    }

    const movies = await response.json();

    // Select a random movie from the list
    const randomMovie = movies.results[Math.floor(Math.random() * movies.results.length)];

    res.json({
      randomMovie: {
        title: randomMovie.title,
        genres: randomMovie.genre_ids, // Assuming TMDB returns genre IDs
        releaseDate: randomMovie.release_date,
        overview: randomMovie.overview,
        // Include additional information as needed
        // Add any other properties you want to include
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch random movie with default parameters" });
  }
});

// This route will handle the random movie request with selected parameters
app.post('/random/selected', async (req, res) => {
  try {
    // Extract parameters from the request body
    const { genres, decades, rating, runtime } = req.body;

    // Construct the API request parameters
    const selectedParams = {
      with_genres: genres.join('|'), // Using | as OR operator for default values
      primary_release_date: decades.join('|'),
      vote_average: `0,${rating}`, // Using , as AND operator for selected parameters
      with_runtime: `${runtime},${runtime}`,
    };

    const externalApiUrl = `https://api.themoviedb.org/3/discover/movie?api_key=${apiKey}&${new URLSearchParams(selectedParams)}`;
    const response = await fetch(externalApiUrl);

    if (!response.ok) {
      throw new Error("Error in response");
    }

    const movies = await response.json();

    if (movies.results.length === 0) {
      throw new Error("No matching movies found");
    }

    // Select a random movie from the list
    const randomMovie = movies.results[Math.floor(Math.random() * movies.results.length)];

    res.json({
      randomMovie: {
        title: randomMovie.title,
        genres: randomMovie.genre_ids,
        releaseDate: randomMovie.release_date,
        overview: randomMovie.overview,
      },
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to fetch random movie with selected parameters" });
  }
});

// Connect to MongoDB when the server starts
run().catch(console.dir);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
