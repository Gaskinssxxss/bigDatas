const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const dbName = "sentimen";
const collectionNames = ["negative", "neutral", "positive"];

const mongoURL = `mongodb://bmblx999:indra999@ac-aitzldg-shard-00-00.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-01.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-02.uoyd2xl.mongodb.net:27017/${dbName}?replicaSet=atlas-vrw4js-shard-0&ssl=true&authSource=admin`;
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
