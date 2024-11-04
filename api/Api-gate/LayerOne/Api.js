const express = require("express");
const mongoose = require("mongoose");
const morgan = require("morgan");

const app = express();
app.use(morgan("dev"));

const collectionName = "raw_data";

const mongoURL =
  "mongodb://bmblx999:indra999@ac-aitzldg-shard-00-00.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-01.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-02.uoyd2xl.mongodb.net:27017/rawData?replicaSet=atlas-vrw4js-shard-0&ssl=true&authSource=admin";

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
