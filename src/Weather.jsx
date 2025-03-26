import SevenDays from "./SevenDays"; //import SevenDays file
import AirCondition from "./AirCondtion"; //import AirCondition file
import HourlyWeather from "./HourlyWeather"; //import HourlyWeather file
import { useCallback, useEffect, useMemo, useRef, useState } from "react"; //import useCallback, useEffect, useMemo, useRef, useState from react
//component WeatherApp
function WeatherApp() {
  //states used
  const [input, setInput] = useState("Lahore");
  const [city, setCity] = useState({});
  const [weather, setWeather] = useState({});
  const [debouncedInput, setDebouncedInput] = useState("Lahore");
  const [error, setError] = useState("");
  const [weekDays, setDays] = useState([]);
  //hooj useref used
  const calTime = useRef(0);

  // Submit form to get input value to store in input state
  function handleChange(e) {
    setInput(e.target.value);
  }
  // Debounce input to prevent excessive API calls
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setDebouncedInput(input);
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, [input]); //To change input this hook re-render and wiath in user input 1.5 second wait

  useEffect(() => {
    const fetchData = async () => {
      //used function in aync to used in await
      try {
        if (debouncedInput) {
          setError("");
          //Api data Store in variable
          const url = `https://geocoding-api.open-meteo.com/v1/search?name=${debouncedInput}&count=10&language=en&format=json`;
          //In asyschronous work to used await in data in fetch
          const response = await fetch(url);
          //In asyschronous work to used await readable form data in json format
          const data = await response.json();
          //check condition data resulth available and data resulth lenght >0 to enter in condition otherwise in else condtion execute
          if (data.results && data.results.length > 0) {
            setCity(data);
            // Extract data from an API and resulth 0 index latitide
            const latitude = data.results[0].latitude;
            const longitude = data.results[0].longitude;
            //Api data Store in variable
            const weatherUrl = `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&daily=temperature_2m_max,temperature_2m_min,precipitation_probability_max,weathercode,sunrise,sunset&hourly=temperature_2m,relative_humidity_2m,wind_speed_10m,weathercode,precipitation_probability,apparent_temperature,uv_index&timezone=auto&forecast_days=7`;
            //In asyschronous work to used await in data in fetch
            const weatherResponse = await fetch(weatherUrl);
            //In asyschronous work to used await readable form data in json format
            const weatherData = await weatherResponse.json();
            //Store Api Redable data in State in Weather
            setWeather(weatherData);
          } else {
            //If condition in not exeucte to else condition execute
            setError("City not found. Please try another location.");
            setCity({});
            setWeather({});
          }
        }
        //Any error in receive in try to get catch and display error in console and display
      } catch (error) {
        console.error("Error fetching weather data:", error);
        setError("Failed to fetch weather data. Please try again.");
      }
    };

    fetchData(); //call function fetchData
  }, [debouncedInput]); //to change sate debouncedInput tu excute in useEffect

  // Set current time and weekdays
  useEffect(() => {
    //Check condition city state in available data in results and array
    if (city.results && city.results[0]) {
      const timezone = city.results[0].timezone; //get city state in timezone data
      const date = new Date(); //get current date in used new Date() method
      // Intl.DateTimeFormat method in js return in object and exctract data in object timezone, hour, hour12
      const formatter = new Intl.DateTimeFormat("en-US", {
        timeZone: timezone,
        hour: "2-digit",
        hour12: false,
      });
      // Intl.DateTimeFormat method in js return in object and exctract data in object weeday

      const weekdayFormatter = new Intl.DateTimeFormat("en-US", {
        weekday: "long", //extract data in weekdays in full form
      });
      const today = new Date(); //get current date in used new Date() method
      const days = [];
      //Exctract data in 7 days Full form eg(MONDAY,TUSDAY...) and store days array
      for (let i = 0; i < 7; i++) {
        const nextDay = new Date();
        nextDay.setDate(today.getDate() + i);
        days.push(weekdayFormatter.format(nextDay));
      }
      setDays(days);
      const localHour = Number.parseInt(formatter.format(date)); //Get time in timezone and other countries
      calTime.current = localHour;
    }
  }, [city]); //re-render useEffect

  //Used Hook UseMemo to not extract data in weather daily sunrise in weather change and exctract data
  const sunrise = useMemo(() => {
    const a = weather?.daily?.sunrise?.[0];
    return a ? Number(a.slice(11, 13)) : null;
  }, [weather]);
  //Used Hook UseMemo to not extract data in weather daily sunset in weather change and exctract data
  const sunset = useMemo(() => {
    const a = weather?.daily?.sunset?.[0];
    return a ? Number(a.slice(11, 13)) : null;
  }, [weather]);

  //getWeatherIcon is callback to pass props in sunrise or sunset calculate to re-create function
  const getWeatherIcon = useCallback(
    (code, time) => {
      //check is time in code pass parameters hook not undefined used turnanry operator codition is false to store in true
      const isDayTime =
        time !== undefined && sunrise !== null && sunset !== null
          ? time >= sunrise && time <= sunset
          : true; // Default
      const icons = {
        0: isDayTime
          ? "/Weather-Animated-icons/Clear sky.gif"
          : "/Weather-Animated-icons/Night.gif",
        1: isDayTime
          ? "/Weather-Animated-icons/Clear sky.gif"
          : "/Weather-Animated-icons/Night.gif",
        2: isDayTime
          ? "/Weather-Animated-icons/Partly cloudy.gif"
          : "/Weather-Animated-icons/cloudy-night.gif",
        3: isDayTime
          ? "/Weather-Animated-icons/Overcast.gif"
          : "/Weather-Animated-icons/cloudy-night.gif",
        45: isDayTime
          ? "/Weather-Animated-icons/Fog or mist.gif"
          : "/Weather-Animated-icons/night fog.gif",
        48: isDayTime
          ? "/Weather-Animated-icons/Foggy.gif"
          : "/Weather-Animated-icons/night fog.gif",
        51: "/Weather-Animated-icons/Drizzle.gif",
        53: "/Weather-Animated-icons/Drizzle.gif",
        55: "/Weather-Animated-icons/Drizzle.gif",
        61: "/Weather-Animated-icons/Rain showers.gif",
        63: "/Weather-Animated-icons/Rain showers.gif",
        65: "/Weather-Animated-icons/Rain showers.gif",
        80: "/Weather-Animated-icons/Rain showers.gif",
        81: "/Weather-Animated-icons/Rain showers.gif",
        82: "/Weather-Animated-icons/Rain showers.gif",
        95: "/Weather-Animated-icons/Thunderstorm.gif",
        96: "/Weather-Animated-icons/Thunderstorm.gif",
        99: "/Weather-Animated-icons/Thunderstorm.gif",
      };
      return icons[code] || "/Weather-Animated-icons/Default.gif";
    },
    [sunrise, sunset] // ✅ Add `weather` as dependency if sunrise() & sunset() depend on it
  );

  //getgetWeatherCondition is callback to pass props in every render to create function send props functions
  const getWeatherCondition = useCallback((code) => {
    const weatherNames = {
      0: "Sunny",
      1: "Clear",
      2: "Cloudy",
      3: "Overcast",
      45: "Fog",
      48: "Fog",
      51: "Drizzle",
      53: "Drizzle",
      55: "Drizzle",
      61: "Rain",
      63: "Rain",
      65: "Heavy Rain",
      71: "Snow",
      73: "Snow",
      75: "Heavy Snow",
      77: "Snow Grains",
      80: "Rain Showers",
      81: "Rain Showers",
      82: "Heavy Rain",
      85: "Snow Showers",
      86: "Snow Showers",
      95: "Thunderstorm",
      96: "Thunderstorm",
      99: "Thunderstorm",
    };

    return weatherNames[code] || "Unknown";
  }, []);

  //BY default submit form behavior is refresh page to used preventDefault is remove by default behavior
  function handleSubmit(e) {
    e.preventDefault();
    setDebouncedInput(input); // Immediately trigger search on form submit
  }

  return (
    <div className="container mx-auto mt-[2%] p-4 bg-gray-200 rounded-lg shadow-lg">
      {/* Search Bar */}
      <div className="mb-6">
        <form onSubmit={handleSubmit} className="flex items-center">
          <input
            className="w-full md:w-1/2 p-3 border border-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="text"
            placeholder="Search for a city..."
            value={input}
            onChange={handleChange}
          />
        </form>
        {error && <p className="text-red-600 mt-2">{error}</p>}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Current Weather */}
        <div className="lg:col-span-3 bg-white rounded-lg p-6 shadow">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center">
            <div>
              <h2 className="text-3xl font-bold text-gray-800">
                {city.results?.[0]?.name || "Enter a city"}
                <span className="text-lg font-normal ml-2 text-gray-600">
                  {city.results?.[0]?.country || ""}
                </span>
              </h2>
              <p className="text-sm text-gray-600">
                Chance of rain:{" "}
                {weather.daily?.precipitation_probability_max
                  ? `${weather.daily.precipitation_probability_max[0]}%`
                  : "0%"}
              </p>
            </div>
            <div className="flex items-center mt-4 md:mt-0">
              <img
                src={
                  weather?.daily?.weathercode?.[0] !== undefined
                    ? getWeatherIcon(
                        weather.daily.weathercode[0],
                        calTime.current
                      )
                    : "/placeholder.svg?height=80&width=80"
                }
                alt="Weather Icon"
                className="w-16 h-16"
              />
              <div className="ml-4">
                <p className="text-4xl font-semibold text-blue-600">
                  {weather.hourly?.temperature_2m &&
                  calTime.current < weather.hourly.temperature_2m.length
                    ? Math.round(weather.hourly.temperature_2m[calTime.current])
                    : "--"}
                  <sup>°</sup>
                </p>
                <p className="text-sm text-gray-700">
                  {weather?.daily?.weathercode?.[0] !== undefined
                    ? getWeatherCondition(weather.daily.weathercode[0])
                    : ""}
                </p>
              </div>
            </div>
          </div>
          {/* Today's Hourly Forecast */}
          <HourlyWeather
            calTime={calTime}
            weather={weather}
            getWeatherIcon={getWeatherIcon}
          />
          {/* Air Conditions */}
          <AirCondition weather={weather} calTime={calTime} />
        </div>

        {/* 7-Day Forecast */}
        <SevenDays
          weekDays={weekDays}
          weather={weather}
          getWeatherIcon={getWeatherIcon}
          getWeatherCondition={getWeatherCondition}
        />
      </div>
    </div>
  );
}

export default WeatherApp;
