const express = require("express");
const fs = require("fs");
const app = express();
const PORT = 5001;

// Parsing body JSON
app.use(express.json());

const iotFilePath = "Iot.json";
let iotData = JSON.parse(fs.readFileSync(iotFilePath, "utf8"));

// Endpoint GET untuk mendapatkan data
app.get("/iot", (req, res) => {
  res.json(iotData);
});

// Endpoint POST untuk menambahkan data baru
app.post("/iot", (req, res) => {
  const newData = req.body;

  // Validasi data jika perlu
  if (!newData || !newData.header || !newData.title || !newData.description) {
    return res.status(400).json({ error: "Invalid data format" });
  }

  // Tambahkan data baru ke array iotData
  iotData.push(newData);

  // Simpan data baru ke file JSON
  fs.writeFileSync(iotFilePath, JSON.stringify(iotData, null, 2), "utf8");

  res.status(201).json({ message: "Data added successfully" });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
