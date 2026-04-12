# Gender Classification API

A Node.js/Express backend API that integrates with the Genderize.io service to classify names by gender.

## Overview

This API provides a single endpoint that:
- Accepts a name query parameter
- Calls the Genderize API to get gender information
- Processes the response with confidence logic
- Returns a structured JSON response

## Features

✅ External API Integration with Genderize.io
✅ Confidence Logic (probability ≥ 0.7 AND sample_size ≥ 100)
✅ Comprehensive Error Handling
✅ Edge Case Management (null gender or zero count)
✅ CORS Support for cross-origin requests
✅ Proper HTTP Status Codes
✅ ISO 8601 Timestamp Generation
✅ Input Validation

## Requirements

- Node.js (v12 or higher)
- npm or yarn

## Installation

```bash
npm install
```

This installs:
- `express` - Web server framework
- `axios` - HTTP client for external API calls

## Running the Server

```bash
npm start
```

The server will start on `http://localhost:3000` by default.

You can specify a custom port with the `PORT` environment variable:
```bash
PORT=5000 npm start
```

## API Endpoints

### 1. Classify Name
**Endpoint:** `GET /api/classify?name={name}`

**Query Parameters:**
- `name` (required): The name to classify (must be a non-empty string)

**Success Response (200 OK):**
```json
{
  "status": "success",
  "data": {
    "name": "john",
    "gender": "male",
    "probability": 0.99,
    "sample_size": 1234,
    "is_confident": true,
    "processed_at": "2026-04-01T12:00:00Z"
  }
}
```

**Error Responses:**

- **400 Bad Request** - Missing or empty name parameter
  ```json
  {
    "status": "error",
    "message": "Missing or empty name parameter"
  }
  ```

- **422 Unprocessable Entity** - name is not a string
  ```json
  {
    "status": "error",
    "message": "name is not a string"
  }
  ```

- **200 OK** - No prediction available (edge case)
  ```json
  {
    "status": "error",
    "message": "No prediction available for the provided name"
  }
  ```

- **502 Bad Gateway** - External API unavailable
  ```json
  {
    "status": "error",
    "message": "External API unavailable"
  }
  ```

- **500 Internal Server Error** - Server error
  ```json
  {
    "status": "error",
    "message": "Internal server error"
  }
  ```

### 2. Health Check
**Endpoint:** `GET /health`

**Response:**
```json
{
  "status": "ok"
}
```

## Processing Rules

The API applies the following processing rules to the Genderize API response:

1. **Field Extraction:** Extracts `gender`, `probability`, and `count` from the Genderize response
2. **Field Renaming:** Renames `count` to `sample_size`
3. **Confidence Logic:** Computes `is_confident` as:
   - `true` when `probability >= 0.7` AND `sample_size >= 100` (both conditions must pass)
   - `false` otherwise
4. **Timestamp:** Generates `processed_at` in UTC, ISO 8601 format on every request
5. **Name Normalization:** Returns the name in lowercase

## Edge Cases

The API handles the following edge cases:

- **Null Gender**: If the Genderize API returns `gender: null`, the endpoint returns a 200 OK with an error message
- **Zero Sample Size**: If the Genderize API returns `count: 0`, the endpoint returns a 200 OK with an error message
- **Missing Parameter**: If the `name` query parameter is missing or empty, returns 400 Bad Request
- **Invalid Type**: If the `name` parameter is not a string, returns 422 Unprocessable Entity
- **External API Timeout**: If the Genderize API is unreachable, returns 502 Bad Gateway
- **Server Error**: Any other error returns 500 Internal Server Error

## Testing

### Test Examples

```bash
# Valid name
curl "http://localhost:3000/api/classify?name=john"

# Valid name with high confidence
curl "http://localhost:3000/api/classify?name=maria"

# Missing parameter
curl "http://localhost:3000/api/classify"

# Empty parameter
curl "http://localhost:3000/api/classify?name="

# Health check
curl "http://localhost:3000/health"
```

### Expected Results

**High Confidence Example:**
```bash
curl "http://localhost:3000/api/classify?name=john"
# Returns: gender="male", probability=0.99, sample_size=1234, is_confident=true
```

**Low Confidence Example (probability < 0.7):**
```bash
curl "http://localhost:3000/api/classify?name=alex"
# Returns: gender="male", probability=0.5, sample_size=100, is_confident=false (probability check fails)
```

**Low Sample Size Example:**
```bash
curl "http://localhost:3000/api/classify?name=uncommonname"
# Returns: gender="male", probability=0.8, sample_size=5, is_confident=false (sample_size check fails)
```

## Deployment

This API is ready to be deployed to:
- Vercel
- Railway
- Heroku
- AWS
- PXXL App
- Or any Node.js compatible hosting platform

### Environment Variables

- `PORT` (optional): Server port (default: 3000)

### Deployment Steps

1. Push your code to a GitHub repository
2. Connect your hosting platform to the repository
3. Set the start command to `npm start`
4. Deploy
5. Test your live endpoint

## Performance

- **Response Time**: < 500ms (excluding external API latency)
- **Concurrency**: Handles multiple simultaneous requests without issues
- **External API Timeout**: 5 seconds (to prevent hanging requests)

## Architecture

```
Request → Validation → Genderize API Call → Data Processing → Response
   ↓          ↓              ↓                    ↓              ↓
 Query      Check         Fetch Gender       Confidence      JSON
Parameter   Types         Classification     Calculation     Response
```

## Dependencies

### Production Dependencies
- **express** (^4.18.2) - Web server framework for routing and middleware
- **axios** (^1.6.0) - Promise-based HTTP client for external API calls

## License

ISC

## Support

For issues or questions, please check the test examples provided in this README.
