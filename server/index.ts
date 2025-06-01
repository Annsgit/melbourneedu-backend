import express from "express";
import path from "path";
import { fileURLToPath } from "url";

const app = express();
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ✅ Serve from ./public relative to /server
const staticPath = path.join(__dirname, "../server/public");
console.log("✅ Using staticPath:", staticPath);

app.use(express.static(staticPath));

app.get("/api/status", (_, res) => {
  res.json({ status: "OK" });
});

app.get("*", (req, res) => {
  res.sendFile("index.html", { root: staticPath });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`✅ Server listening on port ${PORT}`);
});
