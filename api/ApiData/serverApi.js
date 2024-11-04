const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5000;

app.use(express.json());

const apiFilePath = "api.json";
let apiData = JSON.parse(fs.readFileSync(apiFilePath, "utf8"));

app.get("/api", (req, res) => {
  res.json(apiData);
});

app.post("/api", (req, res) => {
  const newData = req.body;

  if (!newData || !newData.header || !newData.title || !newData.description) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  apiData.push(newData);
  fs.writeFileSync(apiFilePath, JSON.stringify(apiData, null, 2), "utf8");

  res.status(201).json({ message: "Data added successfully" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http:http://localhost:${PORT}`);
});
