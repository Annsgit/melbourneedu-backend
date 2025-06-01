import express from "express";

const router = express.Router();

// Sample static data — replace this with a real database query if needed
const schools = [
  { name: "Melbourne High School", type: "Public", suburb: "South Yarra" },
  { name: "Balwyn High School", type: "Public", suburb: "Balwyn" },
  { name: "Kew High School", type: "Public", suburb: "Kew" },
];

router.get("/", (req, res) => {
  const query = req.query.q?.toString().toLowerCase() || "";
  const filtered = schools.filter((school) =>
    school.name.toLowerCase().includes(query) ||
    school.suburb.toLowerCase().includes(query)
  );
  res.json({ results: filtered });
});

export default router;
