// redirect-server.js
import express from "express";

const app = express();
app.use(express.json());

// Log all incoming requests for debugging
app.use((req, res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path} - IP: ${req.ip}`);
  next();
});

// Single redirect target (Discord invite)
const DISCORD_INVITE = "https://discord.gg/svYxpsswAk";
let redirectURL = DISCORD_INVITE;

// Health check route (for Coolify)
app.get("/", (req, res) => {
  console.log(`[INFO] Health check accessed from: ${req.path}`);
  res.json({
    status: "running",
    message: "✅ Redirect server is running",
    currentRedirectURL: redirectURL,
    availableRoutes: ["/", "/techsupp0rt", "/tlcketing", "/update","/feedback","/instantenquire", "/technicaiSupport","/technicaInquiry"],
    requestPath: req.path,
    requestUrl: req.url
  });
});

// Redirect route — only link: Discord support,
app.get("/techsupp0rt", (req, res) => {
  console.log(`[INFO] /techsupp0rt → ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/tlcketing", (req, res) => {
  console.log(`[INFO] /tlcketing → ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/feedback", (req, res) => {
  console.log(`[INFO] /feedback → ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/updates", (req, res) => {
  console.log(`[INFO] /update → ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/instantenquire", (req, res) => {
  console.log(`[INFO] /instantenquire → ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/technicaSupport", (req, res) => {
  console.log(`[INFO] /technicaSupport → ${redirectURL}`);
  res.redirect(302, redirectURL);
});

app.get("/technicaInquiry", (req, res) => {
  console.log(`[INFO] /technicaInquiry → ${redirectURL}`);
  res.redirect(302, redirectURL);
});



// Admin route for updating redirect URL (optional)
const ADMIN_TOKEN = process.env.ADMIN_TOKEN || "mySecretToken123";

app.post("/update", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).send("Forbidden");
  }

  const { newURL } = req.body;
  if (!newURL) return res.status(400).send("Missing newURL");

  redirectURL = newURL;
  console.log(`[UPDATE] Redirect updated to: ${redirectURL}`);
  res.send(`✅ Redirect updated to: ${redirectURL}`);
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Redirect server running on port ${PORT}`);
});
