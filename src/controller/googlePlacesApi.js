const axios = require("axios");
const apiKey = "AIzaSyBZPWoZUXk1KJxlu0YoPfIWQXyPYL92EY4";
const currentLocation = "Dallas";
const radius = 1000; // Radius in meters


const getCoordinates = async (location) => {
  try {
    const response = await axios.get("https://maps.googleapis.com/maps/api/geocode/json", {
      params: {
        address: location,
        key: apiKey,
      },
    });

    const { lat, lng } = response.data.results[0].geometry.location;
    return { lat, lng };
  } catch (error) {
    console.error("Error retrieving coordinates: ", error);
    throw error;
  }
};



const searchPlaces = async (req, res) => {
  const searchQuery = "Nursing Home"; // Example search query

  try {
    const { lat, lng } = await getCoordinates(currentLocation);

    const response = await axios.get(
      "https://maps.googleapis.com/maps/api/place/textsearch/json",
      {
        params: {
          key: apiKey,
          query: searchQuery,
          location: `${lat},${lng}`,
          radius: radius,
        },
      }
    );

    const results = response.data.results.map((place) => ({
      name: place.name,
      address: place.formatted_address,
      location: place.geometry.location,
      rating: place.rating,
      distance: place.distance,
    }));

    res.status(200).json(response.data.results);
  } catch (error) {
    console.error("Error: ", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = {
  searchPlaces,
};
