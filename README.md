# Link Generator - Express Redirect Server

A simple Express.js server that provides dynamic URL redirection with an admin API to update the redirect target without redeployment.

## Features

- 🔄 Dynamic redirect endpoint at `/ticketing`
- 🔐 Admin API to update redirect URL without redeployment
- 🏥 Health check endpoint for monitoring
- 📊 Request logging for debugging
- 🐳 Dockerized for easy deployment

## Project Structure

```
link-generator/
├── redirect-server.js    # Main server file
├── package.json          # Node.js dependencies
├── Dockerfile            # Docker configuration
├── .dockerignore         # Docker ignore file
└── README.md            # This file
```

## Local Development

### Prerequisites

- Node.js 22+ (or use the version specified in Dockerfile)
- npm or yarn

### Setup

1. **Clone the repository**
   ```bash
   git clone <your-repo-url>
   cd link-generator
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the server**
   ```bash
   npm start
   ```

   The server will start on `http://localhost:3000`

### Testing Locally

- Health check: `http://localhost:3000/`
- Redirect endpoint: `http://localhost:3000/ticketing`
- Update redirect URL: `POST http://localhost:3000/update`

## Deployment to Coolify

### Prerequisites

- Coolify instance running
- Git repository with your code
- Docker (handled by Coolify)

### Step-by-Step Deployment

#### 1. Prepare Your Repository

Ensure these files are committed to your repository:
- `redirect-server.js`
- `package.json`
- `package-lock.json`
- `Dockerfile`
- `.dockerignore`

#### 2. Create New Application in Coolify

1. Log in to your Coolify dashboard
2. Navigate to **Projects** → Select/Create a project
3. Click **+ New Resource** → **Application**
4. Choose **Git Source** and connect your repository

#### 3. Configure Application Settings

Go to **Configuration** → **General** and configure:

**Build Pack:**
- Select: `Dockerfile`

**Domains:**
- ⚠️ **IMPORTANT**: Only include the base domain/IP, NOT the path
- ✅ Correct: `http://31.97.143.205` or `http://your-domain.com`
- ❌ Wrong: `http://31.97.143.205/ticketing` (paths are handled by Express)

**Ports:**
- **Ports Exposes**: `3000`
- **Ports Mappings**: `3000:3000`

**Dockerfile Location:**
- `/Dockerfile` (default)

**Base Directory:**
- `/` (root of repository)

#### 4. Environment Variables (Optional)

If you want to customize the admin token, you can add:
- `ADMIN_TOKEN` - Custom admin token (default: `mySecretToken123`)

#### 5. Deploy

1. Click **Save** to save your configuration
2. Click **Deploy** or **Redeploy** to start the deployment
3. Monitor the deployment logs for any errors

#### 6. Verify Deployment

After successful deployment:

1. **Check health**: Visit `http://your-ip/` or `http://your-domain/`
   - Should return JSON with server status

2. **Test redirect**: Visit `http://your-ip/ticketing` or `http://your-domain/ticketing`
   - Should redirect to the default Discord URL

3. **Check logs**: In Coolify, go to **Logs** tab to see request logs

## API Endpoints

### `GET /`
Health check endpoint. Returns server status and information.

**Response:**
```json
{
  "status": "running",
  "message": "✅ Redirect server is running",
  "currentRedirectURL": "https://discord.gg/vJqVEVyv9z",
  "availableRoutes": ["/", "/ticketing", "/ticketing/", "/update"],
  "requestPath": "/",
  "requestUrl": "/"
}
```

### `GET /ticketing`
Main redirect endpoint. Redirects users to the configured URL (302 redirect).

**Example:**
```bash
curl -I http://your-domain/ticketing
# HTTP/1.1 302 Found
# Location: https://discord.gg/vJqVEVyv9z
```

### `POST /update`
Admin endpoint to update the redirect URL. Requires Bearer token authentication.

**Headers:**
```
Authorization: Bearer mySecretToken123
Content-Type: application/json
```

**Body:**
```json
{
  "newURL": "https://example.com/new-link"
}
```

**Example:**
```bash
curl -X POST http://your-domain/update \
  -H "Authorization: Bearer mySecretToken123" \
  -H "Content-Type: application/json" \
  -d '{"newURL": "https://example.com/new-link"}'
```

**Response:**
```
✅ Redirect updated to: https://example.com/new-link
```

## Configuration

### Default Redirect URL

The default redirect URL is set in `redirect-server.js`:
```javascript
let redirectURL = "https://discord.gg/vJqVEVyv9z";
```

You can change this before deployment, or use the `/update` endpoint after deployment.

### Admin Token

The admin token is hardcoded in `redirect-server.js`:
```javascript
const ADMIN_TOKEN = "mySecretToken123";
```

**⚠️ Security Note**: Change this to a strong, random token before deploying to production!

## Troubleshooting

### Issue: Redirect not working, showing health check message

**Problem**: The domain in Coolify includes the path (e.g., `http://31.97.143.205/ticketing`)

**Solution**: 
1. Go to Coolify → Configuration → General → Domains
2. Remove `/ticketing` from the domain
3. Use only the base IP/domain: `http://31.97.143.205`
4. Save and redeploy

### Issue: Deployment fails with nixpacks error

**Problem**: Coolify is trying to use nixpacks instead of Dockerfile

**Solution**: 
1. Ensure `Dockerfile` exists in your repository root
2. In Coolify, set **Build Pack** to `Dockerfile` (not Auto-detect)
3. Redeploy

### Issue: Port conflicts

**Problem**: Port 3000 is already in use

**Solution**:
1. Change the port in `redirect-server.js` or use `PORT` environment variable
2. Update Coolify port mappings accordingly

### Issue: Cannot update redirect URL

**Problem**: 403 Forbidden when calling `/update`

**Solution**:
1. Check that you're using the correct Bearer token
2. Ensure the `Authorization` header is formatted as: `Bearer <token>`
3. Check server logs in Coolify for authentication errors

## Docker Build

You can build and test the Docker image locally:

```bash
# Build the image
docker build -t link-generator .

# Run the container
docker run -p 3000:3000 link-generator

# Test
curl http://localhost:3000/ticketing
```

## Development

### Adding New Routes

To add new redirect routes, add them to `redirect-server.js`:

```javascript
app.get("/new-route", (req, res) => {
  res.redirect(302, redirectURL);
});
```

### Modifying Default Redirect

Edit the `redirectURL` variable in `redirect-server.js`:

```javascript
let redirectURL = "https://your-new-default-url.com";
```

## License

This project is open source and available for use.

## Support

For issues or questions:
1. Check the Coolify logs for error messages
2. Verify all configuration settings match this README
3. Test locally first before deploying

---

**Last Updated**: December 2025

