const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const dbName = "batchData";
const collectionNames = [
  "Sentimen Presiden Jokowi",
  "Dinamikambojo",
  "Sentimen Presiden Prabowo",
];

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

app.get("/layer2/data1", async (req, res) => {
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

app.get("/layer2/data2", async (req, res) => {
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

app.get("/layer2/data3", async (req, res) => {
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

const PORT = process.env.PORT || 6001;

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
