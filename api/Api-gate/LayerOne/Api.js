const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const collectionName = "raw_data";

const mongoURL =
  "";

mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("Koneksi ke MongoDB Atlas berhasil!");
  })
  .catch((error) => {
    console.error("Koneksi ke MongoDB Atlas gagal:", error);
  });

app.get("/layer1/data", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionName);

    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data dari database", error });
  }
});

const PORT = process.env.PORT || 6000;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
