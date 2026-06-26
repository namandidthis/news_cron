import express from "express";

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON
app.use(express.json());

// Basic GET route
app.get("/", (req, res) => {
  res.send("Hello World from Bun + Express!");
});

// A sample API route returning JSON
app.get("/api/data", (req, res) => {
  res.json({ status: "success", runtime: "Bun" });
});

app.listen(PORT, () => {
  console.log(`🚀 Express server running via Bun on port ${PORT}`);
});
