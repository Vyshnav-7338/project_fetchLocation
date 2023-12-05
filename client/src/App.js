import React, { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [location, setLocation] = useState({
    name: "",
    latitude: null,
    longitude: null,
  });

  const getLocation = async () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          try {
            const response = await axios.get(
              `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=YOUR_GOOGLE_MAPS_API_KEY`// YOUR_GOOGLE_MAPS_API_KEY
            );

            if (response.data.results.length > 0) {
              const name = response.data.results[0].formatted_address;
              setLocation({ latitude, longitude, name });
            } else {
              console.error("No results found for reverse geocoding.");
            }
          } catch (error) {
            console.error("Error fetching location name:", error);
          }
        },
        (error) => {
          alert("User Location is off", error);
        }
      );
    } else {
      console.error("Geolocation is not supported by this browser.");
    }
  };

  const saveLocation = async () => {
    try {
      const response = await axios.post(
        "http://localhost:5000/api/location",
        location
      );
      console.log("Location saved:", response.data);
    } catch (error) {
      console.error("Error saving location:", error);
    }
  };

  useEffect(() => {
    getLocation();
  }, []);

  return (
    <div className="container">
      <h1>Location Tracker</h1>
      {location.latitude && location.longitude && (
        <div className="location-info">
          <p>Name: {location.name}</p>
          <p>Latitude: {location.latitude}</p>
          <p>Longitude: {location.longitude}</p>
          <button onClick={saveLocation}>Save Location</button>
        </div>
      )}
    </div>
  );
}

export default App;
