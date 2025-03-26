import PropTypes from "prop-types";
import React from "react";

// Using React.memo to optimize rendering and prevent unnecessary re-renders
const HourlyWeather = React.memo(({ calTime, weather, getWeatherIcon }) => {
  
  // Generate an array of hourly time values starting from the current time
  const hourlyTime = calTime?.current
    ? [
        calTime.current,
        calTime.current + 2,
        calTime.current + 4,
        calTime.current + 6,
        calTime.current + 8,
        calTime.current + 10,
      ]
    : [];

  // Function to format time in 12-hour AM/PM format
  function formatTimeAMPM(time) {
    if (time === undefined || isNaN(time)) {
      return "Invalid Time"; // Handling invalid time values
    }

    const hour = time % 24; // Ensure the hour stays within 24-hour format
    const suffix = hour < 12 ? "AM" : "PM"; // Determine AM or PM
    const formattedHour = hour % 12 || 12; // Convert to 12-hour format

    return `${formattedHour}:00 ${suffix}`;
  }

  return (
    <>
      {/* Container for hourly weather forecast */}
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Today&apos;s Forecast</h3>

        {/* Grid layout for displaying hourly weather information */}
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-4">
          {hourlyTime.map((time, i) => (
            <div key={i} className="bg-slate-50 p-3 rounded-lg text-center">
              {/* Display formatted time */}
              <p className="text-sm font-medium">{formatTimeAMPM(time)}</p>

              {/* Display weather icon if data is available; otherwise, use placeholder */}
              <img
                src={
                  weather?.hourly?.weathercode &&
                  time < weather.hourly.weathercode.length
                    ? getWeatherIcon(weather.hourly.weathercode[time], time)
                    : "/dist/Weather-Animated-icons/Clear sky.gif"
                }
                alt="Weather Icon"
                className="w-10 h-10 mx-auto my-2"
              />

              {/* Display temperature if data is available; otherwise, show "--" */}
              <p className="font-semibold">
                {weather?.hourly?.temperature_2m &&
                time < weather.hourly.temperature_2m.length
                  ? Math.round(weather.hourly.temperature_2m[time])
                  : "--"}
                <sup>°</sup>
              </p>
            </div>
          ))}
        </div>
      </div>
    </>
  );
});

// Set a display name for debugging purposes
HourlyWeather.displayName = "HourlyWeather";

// Define PropTypes for type-checking and ensuring valid props
HourlyWeather.propTypes = {
  calTime: PropTypes.object.isRequired, // Object containing the current time
  weather: PropTypes.shape({
    hourly: PropTypes.shape({
      weathercode: PropTypes.arrayOf(PropTypes.number), // Array of weather codes for hourly data
      temperature_2m: PropTypes.arrayOf(PropTypes.number), // Array of temperature values
    }),
  }).isRequired,
  getWeatherIcon: PropTypes.func.isRequired, // Function to retrieve weather icons
};

export default HourlyWeather;
