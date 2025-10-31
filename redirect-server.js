
// redirect-server.js
import express from "express";

const app = express();
app.use(express.json());

// Initial redirect target
let redirectURL = "https://discord.gg/vJqVEVyv9z";

// Main redirect route
app.get("/wPuRyTfgFhb", (req, res) => {
  console.log(`[INFO] Redirecting to: ${redirectURL}`);
  res.redirect(302, redirectURL);
});

// Optional: update redirect target dynamically (secured by a simple token)
const ADMIN_TOKEN = "mySecretToken123"; // change this to anything secret

app.post("/update", (req, res) => {
  const auth = req.headers.authorization;
  if (auth !== `Bearer ${ADMIN_TOKEN}`) {
    return res.status(403).send("Forbidden");
  }

  const { newURL } = req.body;
  if (!newURL) return res.status(400).send("Missing newURL");

  redirectURL = newURL;
  console.log(`[UPDATE] Redirect updated to: ${redirectURL}`);
  res.send(`✅ Redirect updated to: ${redirectURL}`);
});

// Health check
app.get("/", (_, res) => res.send("Redirect server running OK"));

app.listen(8080, () => {
  console.log("🚀 Redirect server live on port 8080");
});
