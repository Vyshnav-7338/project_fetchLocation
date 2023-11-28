import React, { useState } from "react";
import axios from "axios";

function App() {
  const [location, setLocation] = useState(null);

  const handleRegister = async () => {
    try {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            setLocation({ type: "Point", coordinates: [longitude, latitude] });
          },
          (error) => {
            console.error("Error getting location:", error.message);
          }
        );
      } else {
        console.error("Geolocation is not supported by this browser.");
      }

      console.log(location);
      const response = await axios.post("http://localhost:3001/api/register", {
        location,
      });

      console.log(response.data.message);
    } catch (error) {
      console.error("Error registering hub:", error);
    }
  };

  return (
    <div>
      <h1>Location Registration</h1>

      <button onClick={handleRegister}>Register</button>
    </div>
  );
}

export default App;
