const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

mongoose.connect("mongodb://localhost/locationDB");

const locationSchema = new mongoose.Schema({
  name: String,
  latitude: Number,
  longitude: Number,
});

const Location = mongoose.model("Location", locationSchema);

app.post("/api/location", async (req, res) => {
  try {
    const { name, latitude, longitude } = req.body;
    const newLocation = new Location({ name, latitude, longitude });
    await newLocation.save();
    res.status(201).json(newLocation);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
