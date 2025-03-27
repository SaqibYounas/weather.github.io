import PropTypes from "prop-types";
import React from "react";

// Using React.memo to optimize rendering and prevent unnecessary re-renders
const SevenDays = React.memo(({ weekDays, weather, getWeatherIcon, getWeatherCondition }) => {
  return (
    <>
      {/* Container for the 7-day weather forecast */}
      <div className="lg:col-span-2 bg-white rounded-lg p-6 shadow">
        <h3 className="font-bold text-lg mb-4">7-Day Forecast</h3>

        {/* Wrapper for daily forecast items */}
        <div className="space-y-4">
          {Array.from({ length: 7 }, (_, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-2 border-b border-gray-100 last:border-0"
            >
              {/* Display the weekday name or "Loading" if not available */}
              <p className="font-medium w-24">{weekDays[i] || "Loading"}</p>

              {/* Section for weather icon and condition text */}
              <div className="flex items-center">
                <img
                  src={
                    weather?.daily?.weathercode?.[i] !== undefined
                      ? getWeatherIcon(weather.daily.weathercode[i]) // Get the weather icon based on the weather code
                      : "Weather-Animated-icons/Clear sky.gif" // Placeholder if data is missing
                  }
                  alt="Weather Icon"
                  className="w-10 h-10 mr-2"
                />

                {/* Display weather condition text or empty if data is missing */}
                <span className="text-sm text-muted-foreground w-20">
                  {weather?.daily?.weathercode?.[i] !== undefined
                    ? getWeatherCondition(weather.daily.weathercode[i]) // Get the condition text (e.g., "Sunny", "Cloudy")
                    : ""}
                </span>
              </div>

              {/* Display max/min temperature with fallback values */}
              <p className="font-semibold">
                {Math.round(weather?.daily?.temperature_2m_max?.[i] ?? 0)}°/
                {Math.round(weather?.daily?.temperature_2m_min?.[i] ?? 0)}°
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

// Set a display name for debugging purposes
SevenDays.displayName = "SevenDays";

// Define PropTypes for type-checking and ensuring valid props
SevenDays.propTypes = {
  weekDays: PropTypes.array.isRequired, // Array of weekday names (e.g., ["Monday", "Tuesday", ...])
  weather: PropTypes.shape({
    daily: PropTypes.object, // Object containing daily weather data
  }).isRequired,
  getWeatherIcon: PropTypes.func.isRequired, // Function to get weather icon based on weather code
  getWeatherCondition: PropTypes.func.isRequired, // Function to get weather condition text
};

export default SevenDays;
