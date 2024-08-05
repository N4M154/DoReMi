import React, { useState, useEffect } from "react";
import axios from "axios";

const moods = [
  "happy",
  "sad",
  "relaxed",
  "energetic",
  "calm",
  "excited",
  "angry",
  "melancholic",
  "romantic",
  "upbeat",
  "dreamy",
  "nostalgic",
];

const backgroundImages = ["url(/images/1.png)", "url(/images/5.png)"];

const App = () => {
  const [selectedMood, setSelectedMood] = useState("");
  const [recommendations, setRecommendations] = useState([]);
  const [error, setError] = useState("");
  const [bgImage, setBgImage] = useState(backgroundImages[0]);

  useEffect(() => {
    const savedIndex = localStorage.getItem("backgroundImageIndex");
    if (savedIndex !== null) {
      setBgImage(backgroundImages[parseInt(savedIndex)]);
    }
  }, []);

  const fetchRecommendations = async () => {
    try {
      setError("");
      const response = await axios.get(`https://ws.audioscrobbler.com/2.0/`, {
        params: {
          method: "tag.getTopTracks",
          tag: selectedMood,
          api_key: import.meta.env.VITE_API_KEY,
          format: "json",
        },
      });
      setRecommendations(response.data.tracks.track);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch recommendations");
    }
  };

  const changeBackground = () => {
    const currentIndex = backgroundImages.indexOf(bgImage);
    const nextIndex = (currentIndex + 1) % backgroundImages.length;
    setBgImage(backgroundImages[nextIndex]);

    // Save the new index to localStorage
    localStorage.setItem("backgroundImageIndex", nextIndex);
  };

  const buttonText = bgImage === backgroundImages[0] ? "DUSK" : "DAWN";

  return (
    <div className="relative flex flex-col h-screen">
      <button
        onClick={changeBackground}
        className="absolute top-4 right-4 bg-transparent text-white border border-white px-4 py-2 rounded-lg hover:bg-white hover:text-black transition duration-200"
      >
        {buttonText}
      </button>
      <div
        className="flex justify-center items-center flex-grow"
        style={{
          backgroundImage: bgImage,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="flex space-x-6 bg-white bg-opacity-70 p-4 rounded-lg">
          <div className="w-full max-w-md p-4 mb-6 bg-gradient-to-r from-green-800 via-slate-800 to-blue-900 border border-black rounded-lg shadow-custom">
            <h1 className="text-3xl flex justify-center font-bold mb-6 text-teal-700">
              DoReMi
            </h1>
            <div className="mb-6">
              <label className="block mb-2 text-lg text-white">
                Select your mood:
              </label>
              <div className="flex">
                <select
                  value={selectedMood}
                  onChange={(e) => setSelectedMood(e.target.value)}
                  className="p-2 border border-gray-300 rounded-l-md focus:outline-none focus:ring-2 focus:ring-pink-500 flex-grow"
                >
                  <option value="">Select...</option>
                  {moods.map((mood) => (
                    <option key={mood} value={mood}>
                      {mood.charAt(0).toUpperCase() + mood.slice(1)}
                    </option>
                  ))}
                </select>
                <button
                  onClick={fetchRecommendations}
                  className="p-2 bg-pink-500 text-white rounded-r-md hover:bg-blue-600 transition duration-200"
                >
                  Get Music Recommendations
                </button>
              </div>
              {error && <p className="text-red-500 mt-4">{error}</p>}
            </div>
          </div>
          {recommendations.length > 0 && (
            <div className="w-full max-w-lg max-h-96 overflow-y-auto bg-white border border-gray-300 rounded-lg shadow-md p-4">
              <div className="overflow-x-auto">
                <table className="min-w-full bg-white border border-gray-300">
                  <thead>
                    <tr>
                      <th className="py-2 px-4 bg-gray-200 border-b font-bold text-xl">
                        Song
                      </th>
                      <th className="py-2 px-4 bg-gray-200 border-b font-bold text-xl">
                        Artist
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {recommendations.map((track, index) => (
                      <tr
                        key={`${track.name}-${track.artist.name}-${index}`}
                        className="hover:bg-gray-100"
                      >
                        <td className="border px-4 py-2 font-medium text-green-700">
                          {track.name}
                        </td>
                        <td className="border px-4 py-2 font-medium">
                          {track.artist.name}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default App;
