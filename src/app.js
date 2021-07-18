function formatDate(timestamp) {
  let date = new Date(timestamp);

  let hours = date.getHours();
  if (hours < 10) {
    hours = `0${hours}`;
  }

  let minutes = date.getMinutes();
  if (minutes < 10) {
    minutes = `0${minutes}`;
  }

  let days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ];

  let day = days[date.getDay()];

  return `${day} ${hours}:${minutes}`;
}

function formatDay(timestamp) {
  let date = new Date(timestamp * 1000);
  let day = date.getDay();
  let days = ["Sun", "Mon", "Tue", "Wed", "Thur", "Fri", "Sat"];
  return days[day];
}

function displayForecast(response) {
  let forecast = response.data.daily;
  let forecastElement = document.querySelector("#forecast");

  let forecastHTML = `<div class="row">`;

  forecast.forEach(function (forecastDay, index) {
    if (index < 5) {
      forecastHTML =
        forecastHTML +
        `
            <div class="col">
              <div class="card">
                <ul>
                  <li>
                    <h6 class="forecast-day">${formatDay(forecastDay.dt)}</h6>
                  </li>
                  <li>
                    <img class="weather-icon" src="https://openweathermap.org/img/wn/${
                      forecastDay.weather[0].icon
                    }@2x.png" />
                  </li>
                  <li>
                    <h5 class="forecast-temperature">
                      <span class="forecast-temperature-max"> ${Math.round(
                        forecastDay.temp.max
                      )}° </span> 
                      <span class="forecast-temperature-min"> ${Math.round(
                        forecastDay.temp.min
                      )}° </span> 
                    </h5>
                  </li>
                </ul>
              </div>
            </div>`;
    }
  });

  forecastHTML = forecastHTML + `</div>`;
  forecastElement.innerHTML = forecastHTML;
}

function getForecast(coordinates) {
  let apiKey = "cccb60e2b71b1ece226b8d97365fb946";
  let apiUrl = `https://api.openweathermap.org/data/2.5/onecall?lat=${coordinates.lat}&lon=${coordinates.lon}&appid=${apiKey}&units=metric`;
  axios.get(apiUrl).then(displayForecast);
}

function displayTemperature(response) {
  let dateElement = document.querySelector("#day-time");
  dateElement.innerHTML = formatDate(response.data.dt * 1000);

  let cityElement = document.querySelector("#city-name");
  cityElement.innerHTML = response.data.name;

  let iconElement = document.querySelector("#current-icon");
  let iconSrc = response.data.weather[0].icon;
  iconElement.setAttribute(
    "src",
    `https://openweathermap.org/img/wn/${iconSrc}@2x.png`
  );
  iconElement.setAttribute("alt", response.data.weather[0].description);

  let temperatureElement = document.querySelector("#current-temperature");
  celsiusTemperature = response.data.main.temp;
  temperatureElement.innerHTML = Math.round(celsiusTemperature);

  let feelsLikeElement = document.querySelector("#feel-temperature");
  feelsLikeElement.innerHTML = Math.round(response.data.main.feels_like);

  let descriptionElement = document.querySelector("#description");
  descriptionElement.innerHTML = response.data.weather[0].description;

  let humidityElement = document.querySelector("#humidity");
  humidityElement.innerHTML = response.data.main.humidity;

  let windElement = document.querySelector("#wind");
  windElement.innerHTML = Math.round(response.data.wind.speed);

  getForecast(response.data.coord);
}

function search(city) {
  let apiKey = "cccb60e2b71b1ece226b8d97365fb946";
  let apiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  axios.get(apiUrl).then(displayTemperature);
}

function searchSubmit(event) {
  event.preventDefault();
  let searchInputElement = document.querySelector("#search-input");
  search(searchInputElement.value);
}

let searchForm = document.querySelector("#search");
searchForm.addEventListener("submit", searchSubmit);

function convertFahrenheit(event) {
  event.preventDefault();
  celsiusLink.classList.remove("active");
  fahrenheitLink.classList.add("active");
  let fahrenheitTemperature = (celsiusTemperature * 9) / 5 + 32;
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(fahrenheitTemperature);
}

function convertCelsius(event) {
  event.preventDefault();
  celsiusLink.classList.add("active");
  fahrenheitLink.classList.remove("active");
  let temperatureElement = document.querySelector("#current-temperature");
  temperatureElement.innerHTML = Math.round(celsiusTemperature);
}

let celsiusTemperature = null;

let fahrenheitLink = document.querySelector("#fahrenheit");
fahrenheitLink.addEventListener("click", convertFahrenheit);

let celsiusLink = document.querySelector("#celsius");
celsiusLink.addEventListener("click", convertCelsius);

search("Kabul");
