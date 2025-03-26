import PropTypes from "prop-types";

function AirCondition({ weather, calTime }) {
  // Array of air condition data
  const airCondition = [
    {
      name: "Real Feel",
      airvalue:
        weather?.hourly?.apparent_temperature?.[calTime.current] ?? 0, // Fallback to 0 if data is unavailable
      sign: <sup>o</sup>, // Degree symbol
      images: "Weather-Animated-icons/hot.gif",
    },
    {
      name: "Wind",
      airvalue:
        weather?.hourly?.wind_speed_10m?.[calTime.current] ?? " ", // Fallback to empty space
      sign:
        weather?.hourly_units?.wind_speed_10m ?? "0", // Wind speed unit
      images: "Weather-Animated-icons/Wind.gif",
    },
    {
      name: "Humidity",
      airvalue:
        weather?.hourly?.relative_humidity_2m?.[calTime.current] ?? " ", // Humidity value
      sign:
        weather?.hourly_units?.relative_humidity_2m ?? "0", // Humidity unit
      images: "Weather-Animated-icons/Humidiltiy.gif",
    },
    {
      name: "UV index",
      airvalue:
        weather?.hourly?.uv_index?.[calTime.current + 10] ?? " ", // UV index with an offset of 10
      sign:
        weather?.hourly_units?.uv_index ?? "0", // UV index unit
      images: "Weather-Animated-icons/UVindex.gif",
    },
  ];

  return (
    <>
      <div className="mt-8">
        <h3 className="font-bold text-lg mb-4">Air Conditions</h3>
        {/* Grid layout for air condition elements */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {airCondition.map((item, index) => (
            <div key={index} className="flex items-center">
              {/* Weather condition image */}
              <img
                src={item.images || "0"}
                alt={item.name}
                className="w-10 h-10 mr-3"
              />
              <div>
                {/* Weather condition name */}
                <p className="text-sm text-muted-foreground">{item.name}</p>
                {/* Weather condition value with unit */}
                <p className="text-lg font-semibold">
                  {Math.round(item.airvalue)}
                  {item.sign}{" "}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
}

// Define PropTypes for type checking
AirCondition.propTypes = {
  weather: PropTypes.shape({
    hourly: PropTypes.shape({
      apparent_temperature: PropTypes.array, // Array of temperatures
      wind_speed_10m: PropTypes.array, // Wind speed data
      relative_humidity_2m: PropTypes.array, // Humidity data
      uv_index: PropTypes.array, // UV index data
    }),
    hourly_units: PropTypes.shape({
      relative_humidity_2m: PropTypes.string, // Humidity unit
      uv_index: PropTypes.string, // UV index unit
      wind_speed_10m: PropTypes.string, // Wind speed unit
    }),
  }).isRequired,
  calTime: PropTypes.shape({
    current: PropTypes.number.isRequired, // Current time index for retrieving weather data
  }).isRequired,
};

export default AirCondition;
