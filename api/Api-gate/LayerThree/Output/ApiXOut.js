const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const dbName = "sentimen";
const collectionNames = ["negative", "neutral", "positive"];

const mongoURL = ``;
mongoose
  .connect(mongoURL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log(`Koneksi ke MongoDB Atlas ke database ${dbName} berhasil!`);
  })
  .catch((error) => {
    console.error(
      `Koneksi ke MongoDB Atlas ke database ${dbName} gagal:`,
      error
    );
  });

app.get("/layer3/services2/negative", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionNames[0]);

    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data dari koleksi 1", error });
  }
});

app.get("/layer3/services2/neutral", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionNames[1]);

    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data dari koleksi 2", error });
  }
});

app.get("/layer3/services2/positive", async (req, res) => {
  try {
    const db = mongoose.connection.db;
    const collection = db.collection(collectionNames[2]);

    const data = await collection.find({}).toArray();
    res.json(data);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Gagal mengambil data dari koleksi 3", error });
  }
});

const PORT = process.env.PORT || 6003;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
