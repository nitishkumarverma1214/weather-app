import {
  getCurrentForcastURL,
  setCurrentForcastURL,
  setHourlyForecastURL,
  dayWiseData,
} from "./app-data.js";

import { loadHourlyData } from "./hourlyweather.js";

const loadForecastUsingGeoLocation = () => {
  navigator.geolocation.getCurrentPosition(({ coords }) => {
    let { latitude: lat, longitude: lon } = coords;
    let location = { lat, lon, name: null };
    setCurrentForcastURL(location);
    setHourlyForecastURL(location);

    setTimeout(loadCurrentWeatherData, 500);
    setTimeout(loadHourlyData, 500);
    setTimeout(reloadBrowser, 500);
  });
};

let getCurrentWeatherData = async () => {
  const response = await fetch(getCurrentForcastURL());
  return response.json();
};

export const formatTemperature = (temp) => {
  return (temp | 0) + "°C";
};

const loadCurrentForcast = ({
  name: city,
  weather: [{ description, icon }],
  main: { temp, temp_min, temp_max },
}) => {
  document.querySelector(".now-temp").textContent = formatTemperature(temp);
  document.querySelector(".city-name").textContent = city;
  document.querySelector(".temp-desc").textContent = description;

  var options = {
    weekday: "short",
    month: "short",
    day: "numeric",
  };
  var today = new Date();
  document.querySelector(".now-date").textContent = today.toLocaleDateString(
    "en-US",
    options
  );

  document.querySelector(".min-max-temp").textContent = `L: ${formatTemperature(
    temp_min
  )}     H: ${formatTemperature(temp_max)}`;
};

const loadFeelsLike = ({ main: { feels_like } }) => {
  document.querySelector(".feels-like-temp").textContent =
    formatTemperature(feels_like);
};

const loadHumidity = ({ main: { humidity } }) => {
  document.querySelector(".humidity-percent").textContent = `${humidity}%`;
};

export const loadCurrentWeatherData = async () => {
  const weatherData = await getCurrentWeatherData();
  loadCurrentForcast(weatherData);
  loadFeelsLike(weatherData);
  loadHumidity(weatherData);
};

function handlePermission() {
  navigator.permissions.query({ name: "geolocation" }).then((result) => {
    if (result.state === "granted") {
      console.log(`permission: ${result.state}`);
      loadForecastUsingGeoLocation();
    } else if (result.state === "prompt") {
      console.log(`permission: ${result.state}`);
      loadForecastUsingGeoLocation();
    } else if (result.state === "denied") {
      console.log(`permission: ${result.state}`);
    }
  });
}

function reloadBrowser() {
  window.onload = function () {
    if (!window.location.hash) {
      window.location = window.location + "#loaded";
      window.location.reload();
    }
  };
}

document.addEventListener("DOMContentLoaded", function () {
  handlePermission();
});
