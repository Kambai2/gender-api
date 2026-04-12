const express = require('express');
const axios = require('axios');

const app = express();
const PORT = process.env.PORT || 3000;

// CORS - Allow all origins
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  next();
});

// Main endpoint: GET /api/classify?name=john
app.get('/api/classify', async (req, res) => {
  try {
    const { name } = req.query;

    // Check if name is missing or empty
    if (!name || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Missing or empty name parameter'
      });
    }

    // Check if name is a string
    if (typeof name !== 'string') {
      return res.status(422).json({
        status: 'error',
        message: 'name is not a string'
      });
    }

    // Call Genderize API
    const apiUrl = `https://api.genderize.io?name=${encodeURIComponent(name)}`;
    const { data } = await axios.get(apiUrl, { timeout: 5000 });

    const { gender, probability, count } = data;

    // If no prediction available
    if (gender === null || count === 0) {
      return res.status(200).json({
        status: 'error',
        message: 'No prediction available for the provided name'
      });
    }

    // Calculate confidence: true if probability >= 0.7 AND count >= 100
    const is_confident = probability >= 0.7 && count >= 100;

    // Get current timestamp
    const processed_at = new Date().toISOString();

    // Return response
    res.status(200).json({
      status: 'success',
      data: {
        name: name.toLowerCase(),
        gender,
        probability,
        sample_size: count,
        is_confident,
        processed_at
      }
    });

  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Internal server error'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
