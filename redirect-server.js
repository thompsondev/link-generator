// redirect-server.js
import express from "express";

const app = express();
app.use(express.json());

// Default redirect link
let redirectURL = "https://discord.gg/vJqVEVyv9z";

// Health check (for Coolify)
app.get("/", (_, res) => res.send("✅ Redirect server is running"));

// --- Main redirect route ---
app.get("/wPuRyTfgFhb", (req, res) => {
  console.log(`[INFO] Redirecting user to: ${redirectURL}`);
  res.redirect(302, redirectURL);
});

// --- Optional admin endpoint to change redirect target dynamically ---
const ADMIN_TOKEN = "mySecretToken123"; // 🔐 Change this to your own secret key

app.post("/update", (req, res) => {
  const authHeader = req.headers.authorization;
  if (authHeader !== `Bearer ${ADMIN_TOKEN}`) {
    console.warn("[WARN] Unauthorized update attempt");
    return res.status(403).send("Forbidden");
  }

  const { newURL } = req.body;
  if (!newURL) {
    return res.status(400).send("Missing newURL");
  }

  redirectURL = newURL;
  console.log(`[UPDATE] Redirect target updated to: ${redirectURL}`);
  res.send(`✅ Redirect updated to: ${redirectURL}`);
});

// --- Start the server ---
const PORT = process.env.PORT || 8080;

// ✅ Listen on 0.0.0.0 so it works with external hosts like Coolify or VPS IPs
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Redirect server live on http://31.97.178.151:${PORT}/wPuRyTfgFhb`);
});
