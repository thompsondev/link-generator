// redirect-server.js
import express from "express";

const app = express();
app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Default redirect target
let redirectURL = "https://discord.gg/vJqVEVyv9z";
let redirectURL2 = "https://discord.gg/5acUatVSnT"

// Health check route (for Coolify)
app.get("/", (req, res) => {
  console.log(`[INFO] Health check accessed from: ${req.path}`);
  res.json({
    status: "running",
    message: "✅ Redirect server is running",
    currentRedirectURL: redirectURL || redirectURL2,
    availableRoutes: ["/", "/tlcketing", "/tlcketing/", "/open-tlcket", "/open-tlcket/", "/update"],
    requestPath: req.path,
    requestUrl: req.url
  });
});

// Redirect route (this is the one you want)
app.get("/tlcketing", (req, res) => {
  console.log(`[INFO] /tlcketing route accessed - Redirecting to: ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/open-tlcket", (req, res) => {
  console.log(`[INFO] /open-tlcket route accessed - Redirecting to: ${redirectURL2}`);
  res.redirect(302, redirectURL2);
});

// Also handle /ticketing/ with trailing slash
app.get("/tlcketing/", (req, res) => {
  console.log(`[INFO] /tlcketing/ route accessed - Redirecting to: ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/open-tlcket/", (req, res) => {
  console.log(`[INFO] /open-tlcket/ route accessed - Redirecting to: ${redirectURL2}`);
  res.redirect(302, redirectURL2);
});

// Admin route for updating redirect URL
const ADMIN_TOKEN = "mySecretToken123";

app.post("/update", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).send("Forbidden");
  }

  const { newURL, newURL2 } = req.body;
  if (!newURL || !newURL2) return res.status(400).send("Missing newURL or newURL2");

  redirectURL = newURL;
  redirectURL2 = newURL2;
  console.log(`[UPDATE] Redirect target updated to: ${redirectURL} | ${redirectURL2}`);
  res.send(`✅ Redirect updated to: ${redirectURL} | ${redirectURL2}`);
});

// Start server
const PORT = process.env.PORT || 3000; // 👈 Important: use 3000 for Coolify default
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Redirect server running on port ${PORT}`);
});
