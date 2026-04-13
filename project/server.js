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
    if (!name || typeof name !== 'string' || name.trim() === '') {
      return res.status(400).json({
        status: 'error',
        message: 'Missing or empty name parameter'
      });
    }

    const normalizedName = name.trim();

    // Call Genderize API
    const apiUrl = `https://api.genderize.io?name=${encodeURIComponent(normalizedName)}`;
    const { data } = await axios.get(apiUrl, { timeout: 5000 });
    const { gender, probability, count } = data || {};

    const probabilityValue = typeof probability === 'number' ? probability : parseFloat(probability) || 0;
    const sampleSize = Number.isInteger(count) ? count : parseInt(count, 10);
    const sample_size = Number.isNaN(sampleSize) ? 0 : sampleSize;
    const is_confident = probabilityValue >= 0.7 && sample_size >= 100;
    const processed_at = new Date().toISOString();

    // Return success response even when the API has no prediction for the name
    res.status(200).json({
      status: 'success',
      data: {
        name: normalizedName.toLowerCase(),
        gender: gender === null ? null : gender,
        probability: probabilityValue,
        sample_size,
        is_confident,
        processed_at
      }
    });

  } catch (error) {
    res.status(502).json({
      status: 'error',
      message: 'External API unavailable'
    });
  }
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
