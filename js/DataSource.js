const MongoClient = require("mongodb").MongoClient;
const axios = require("axios");
const crypto = require("crypto");
const http = require("http");
const socketIo = require("socket.io");

const dbName = "rawData";
const url = `mongodb://bmblx999:indra999@ac-aitzldg-shard-00-00.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-01.uoyd2xl.mongodb.net:27017,ac-aitzldg-shard-00-02.uoyd2xl.mongodb.net:27017/${dbName}?replicaSet=atlas-vrw4js-shard-0&ssl=true&authSource=admin`;
const collectionName = "raw_data";

function generateHash(data) {
  return crypto.createHash("sha256").update(JSON.stringify(data)).digest("hex");
}

async function connectToMongo() {
  try {
    const client = new MongoClient(url);
    await client.connect();
    console.log("Connected to MongoDB");
    return client.db(dbName).collection(collectionName);
  } catch (error) {
    console.error("MongoDB Connection Error:", error);
    return null;
  }
}

async function loadApiDataFromJson() {
  try {
    const response = await axios.get("http://localhost:5000/api");
    return response.data;
  } catch (error) {
    console.error("Error fetching API data from localhost:", error);
    return [];
  }
}

async function loadSensorDataFromJson() {
  try {
    const response = await axios.get("http://localhost:5001/iot");
    return response.data;
  } catch (error) {
    console.error("Error fetching Sensor data from localhost:", error);
    return [];
  }
}

async function insertUniqueData(collection, entry) {
  if (!collection) {
    console.error("No MongoDB collection available for insertion.");
    return;
  }

  try {
    const entryHash = generateHash(entry);
    const exists = await collection.findOne({ dataHash: entryHash });

    if (!exists) {
      const entryWithHash = { ...entry, dataHash: entryHash };
      await collection.insertOne(entryWithHash);
      console.log(`Inserted: ${entry.header}`);
      return entryWithHash;
    } else {
      console.log(`Skipped (duplicate): ${entry.header}`);
      return null;
    }
  } catch (error) {
    console.error("Error inserting data:", error);
    return null;
  }
}

const server = http.createServer();
const io = socketIo(server);

io.on("connection", (socket) => {
  console.log("New client connected");
  socket.on("disconnect", () => {
    console.log("Client disconnected");
  });
});

async function startDataStream() {
  const collection = await connectToMongo();
  if (!collection) {
    console.error("Failed to connect to MongoDB; aborting streaming.");
    return;
  }

  async function fetchDataAndEmit(apiFunc) {
    const data = await apiFunc();
    if (data.length > 0) {
      for (const entry of data) {
        const result = await insertUniqueData(collection, entry);
        if (result) {
          io.emit("new_data", result);
        }
      }
    } else {
      console.log("No data received from API source.");
    }
  }

  setInterval(() => fetchDataAndEmit(loadApiDataFromJson), 60000);
  setInterval(() => fetchDataAndEmit(loadSensorDataFromJson), 60000);
}

startDataStream();
server.listen(3000, () => {
  console.log("Server and socket.io listening on port 3000");
});
