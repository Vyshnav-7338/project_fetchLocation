const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");

const app = express();
const PORT = process.env.PORT || 3001;

app.use(cors());
app.use(bodyParser.json());

mongoose.connect("mongodb://localhost:27017/location");
const db = mongoose.connection;

db.on("error", (error) => {
  console.error("MongoDB connection error:", error);
});
db.once("open", () => {
  console.log("Connected to MongoDB");
});

const locationSchema = new mongoose.Schema({
  location: {
    type: { type: String },
    coordinates: [Number],
  },
});

locationSchema.index({ location: "2dsphere" });

const LocationsModel = mongoose.model("Location", locationSchema);

app.post("/api/register", async (req, res) => {
  try {
    const { location } = req.body;

    if (
      !location ||
      !location.coordinates ||
      location.coordinates.length !== 2
    ) {
      return res.status(400).json({ error: "Invalid location data" });
    }

    const locations = new LocationsModel({ location });
    await locations.save();

    res.status(201).json({ message: "Location registered successfully" });
  } catch (error) {
    console.error("Error registering Location:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});
