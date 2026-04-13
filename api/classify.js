const axios = require('axios');

const normalizeName = (value) => {
  if (Array.isArray(value)) {
    value = value[0];
  }

  if (typeof value !== 'string') {
    return '';
  }

  return value.trim();
};

const sendError = (res, status, message) => {
  return res.status(status).json({
    status: 'error',
    message
  });
};

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  try {
    const normalizedName = normalizeName(req.query.name);

    if (!normalizedName) {
      return sendError(res, 422, 'Missing or empty name parameter');
    }

    const apiUrl = `https://api.genderize.io?name=${encodeURIComponent(normalizedName)}`;
    const { data } = await axios.get(apiUrl, { timeout: 5000 });
    const { gender, probability, count } = data || {};

    const probabilityValue = typeof probability === 'number' ? probability : parseFloat(probability) || 0;
    const sampleSize = Number.isInteger(count) ? count : parseInt(count, 10);
    const sample_size = Number.isNaN(sampleSize) ? 0 : sampleSize;

    if (gender === null || gender === undefined || probabilityValue === 0 || sample_size === 0) {
      return sendError(res, 422, 'Name could not be recognized or classified');
    }

    const is_confident = probabilityValue >= 0.7 && sample_size >= 100;
    const processed_at = new Date().toISOString();

    return res.status(200).json({
      status: 'success',
      data: {
        name: normalizedName.toLowerCase(),
        gender,
        probability: probabilityValue,
        sample_size,
        is_confident,
        processed_at
      }
    });
  } catch (error) {
    return sendError(res, 502, 'External API unavailable');
  }
};
