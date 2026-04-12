# DEPLOYMENT.md - Deployment Guide

This guide provides step-by-step instructions for deploying the Gender Classification API to various platforms.

## Prerequisites

- GitHub repository with your code
- An account on your chosen hosting platform

## Deployment Platforms

### 1. Vercel (Recommended for Node.js)

**Setup:**
1. Go to [vercel.com](https://vercel.com)
2. Sign in with GitHub
3. Click "New Project"
4. Select your GitHub repository
5. Vercel will auto-detect it's a Node.js project
6. Click "Deploy"

**Configuration:**
- Build Command: (leave empty - not needed)
- Output Directory: (leave empty)
- Environment Variables: (none required)
- Start Command: `npm start`

**Test Your Deployment:**
```bash
curl "https://your-project.vercel.app/api/classify?name=john"
```

---

### 2. Railway

**Setup:**
1. Go to [railway.app](https://railway.app)
2. Click "New Project" → "Deploy from GitHub"
3. Select your repository
4. Railway auto-detects Node.js project
5. Add a `PORT` environment variable (optional, defaults to 3000)
6. Click "Deploy"

**Configuration:**
- Build Command: `npm install`
- Start Command: `npm start`
- Port: 3000 (or set PORT environment variable)

**Test Your Deployment:**
```bash
curl "https://your-app.railway.app/api/classify?name=john"
```

---

### 3. Heroku

**Setup:**
1. Go to [heroku.com](https://heroku.com)
2. Click "Create new app"
3. Connect to GitHub repository
4. Click "Deploy Branch"

**Configuration:**
Heroku automatically:
- Installs dependencies from `package.json`
- Runs the `start` script from `package.json`
- Assigns a random PORT environment variable (handled in `server.js`)

**Test Your Deployment:**
```bash
curl "https://your-app-name.herokuapp.com/api/classify?name=john"
```

---

### 4. AWS (with Elastic Beanstalk)

**Setup:**
1. Install AWS CLI and EB CLI
2. In your project directory:
   ```bash
   eb init -p node.js-18 my-app
   eb create my-app-env
   eb deploy
   ```

**Configuration:**
- Platform: Node.js 18
- Instance Type: t2.micro (free tier eligible)

**Test Your Deployment:**
```bash
curl "http://my-app-env.elasticbeanstalk.com/api/classify?name=john"
```

---

### 5. PXXL App

**Setup:**
1. Go to [pxxl.app](https://pxxl.app)
2. Create a new app
3. Connect GitHub repository
4. Deploy

---

## Environment Variables

If needed, create a `.env` file locally (not committed to git):

```
PORT=3000
NODE_ENV=production
```

The server will use the environment variables when available.

---

## Post-Deployment Checklist

After deploying to any platform:

✅ **Test the endpoint:**
```bash
curl "https://your-deployed-url/api/classify?name=john"
```

✅ **Verify response format:**
- Check that `status` is "success"
- Verify all required fields are present
- Confirm CORS header is present

✅ **Test error handling:**
```bash
# Missing parameter
curl "https://your-deployed-url/api/classify"

# Empty parameter
curl "https://your-deployed-url/api/classify?name="
```

✅ **Check health endpoint:**
```bash
curl "https://your-deployed-url/health"
```

✅ **Test from different networks** (if possible) to ensure global accessibility

---

## Troubleshooting

### "Cannot find module 'express'"
- Solution: Run `npm install` before deploying

### "Port already in use"
- Solution: Change port number or use `PORT=5000 npm start`

### "External API timeout"
- The endpoint has a 5-second timeout for the Genderize API
- If experiencing timeouts, the external API may be down
- Check https://api.genderize.io status

### "CORS errors"
- Verify the CORS header is set to `*` in server.js
- Clear browser cache and try again

### "502 Bad Gateway"
- May indicate server startup issue
- Check deployment logs on your platform

---

## Performance Optimization

For production deployments, consider:

1. **Caching** - Cache Genderize API responses with Redis
2. **Load Balancing** - Use multiple instances
3. **Rate Limiting** - Prevent abuse with express-rate-limit
4. **Monitoring** - Use platform's built-in monitoring tools

---

## Getting Your API URL for Submission

After successful deployment, your API URL will be:
- **Vercel**: `https://your-project.vercel.app`
- **Railway**: `https://your-app.railway.app`
- **Heroku**: `https://your-app-name.herokuapp.com`
- **AWS**: `http://your-app-env.elasticbeanstalk.com`

Submit this URL (with `/api/classify?name=test` appended for testing) to the grading system.

---

## Support

For platform-specific issues, check their documentation:
- [Vercel Docs](https://vercel.com/docs)
- [Railway Docs](https://docs.railway.app)
- [Heroku Docs](https://devcenter.heroku.com)
- [AWS EB Docs](https://docs.aws.amazon.com/elasticbeanstalk/)
