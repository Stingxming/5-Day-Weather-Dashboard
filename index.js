var searchHistory = [];
var searchForm = document.querySelector("#search-form");
var searchInput = document.querySelector("#search-input");
var todayContainer = document.querySelector("#today");
var forecastContainer = document.querySelector("#forecast");
var searchHistoryContainer = document.querySelector("#history");
var rootUrl = "https://api.openweathermap.org";
var apiKey = "eecbc200ed61422ddb08e79260faa9ec";

dayjs.extend(window.dayjs_plugin_utc);
dayjs.extend(window.dayjs_plugin_timezone);
// need function to render search history
function renderSearchHistory() {
  searchHistoryContainer.innerHTML = "";
  for (var i = searchHistory.length - 1; i >= 0; i--) {
    var btn = document.createElement("button");
    btn.setAttribute("type", "button");
    btn.setAttribute("class", "history-btn btn bg-dark text-white mt-1");
    btn.setAttribute("data-search", searchHistory[i]);
    btn.textContent = searchHistory[i];
    searchHistoryContainer.append(btn);
  }
}

// todo: function to add to search history and rerun renderSearchHistory
function addSearchHistory(search) {
  if (searchHistory.indexOf(search) !== -1) {
    return;
  }
  searchHistory.push(search);
  localStorage.setItem("search-history", JSON.stringify(searchHistory));
  renderSearchHistory();
}
// todo: function to get search history and rerun renderSearchHistory
function getSearchHistory() {
  var storedHistory = localStorage.getItem("search-history");
  if (storedHistory) {
    searchHistory = JSON.parse(storedHistory);
  }
  renderSearchHistory();
}
// todo: function to render the current weather
function renderCurrentWeather(city, weather) {
  var date = dayjs().format("M/D/YYYY");
  var temp = weather.main.temp;
  var wind = weather.wind.speed;
  var humidity = weather.main.humidity;
  var icon = `${rootUrl}/img/w/${weather.weather[0].icon}.png`;
  var card = document.createElement("div");
  var cardBody = document.createElement("div");
  var heading = document.createElement("h2");
  var weatherIcon = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  card.setAttribute("class", "card");
  cardBody.setAttribute("class", "card-body");
  card.append(cardBody);
  heading.setAttribute("class", "h3 card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");
  heading.textContent = `${city} ${date}`;
  weatherIcon.setAttribute("src", icon);
  weatherIcon.setAttribute("class", "weather-img");
  heading.append(weatherIcon);
  tempEl.textContent = `temp: ${temp}°F`;
  windEl.textContent = `wind: ${wind}MPH`;
  humidityEl.textContent = `humidity: ${humidity}%`;
  cardBody.append(heading, tempEl, windEl, humidityEl);
  todayContainer.innerHTML = "";
  todayContainer.append(card);
}
// todo: function to render the forecast
function renderForecastCard(forecast) {
  var icon = `${rootUrl}/img/w/${forecast.weather[0].icon}.png`;
  var temp = forecast.main.temp;
  var wind = forecast.wind.speed;
  var humidity = forecast.main.humidity;
  var col = document.createElement("div");
  var card = document.createElement("div");
  var cardTitle = document.createElement("h5");
  var weatherIcon = document.createElement("img");
  var tempEl = document.createElement("p");
  var windEl = document.createElement("p");
  var humidityEl = document.createElement("p");
  var cardBody = document.createElement("div");
  col.append(card);
  card.append(cardBody);
  cardBody.append(cardTitle, weatherIcon, tempEl, windEl, humidityEl);
  col.setAttribute("class", "col-md 5-day-card");
  card.setAttribute("class", "card bg-primary h-100 text-white");
  cardBody.setAttribute("class", "card-body p-2");
  cardTitle.setAttribute("class", "card-title");
  tempEl.setAttribute("class", "card-text");
  windEl.setAttribute("class", "card-text");
  humidityEl.setAttribute("class", "card-text");
  cardTitle.textContent = dayjs(forecast.dt_txt).format("M/D/YYYY");
  weatherIcon.setAttribute("src", icon);
  tempEl.textContent = `temp: ${temp}°F`;
  windEl.textContent = `wind: ${wind}MPH`;
  humidityEl.textContent = `humidity: ${humidity}%`;
  forecastContainer.append(col);
}

function renderForecast(fiveDayForecast) {
  var start = dayjs().add(1, "day").startOf("day").unix();
  var end = dayjs().add(6, "day").startOf("day").unix();
  var headingCol = document.createElement("div");
  var heading = document.createElement("h4");
  headingCol.setAttribute("class", "col-12");
  heading.textContent = "Five Day Forecast";
  headingCol.append(heading);
  forecastContainer.innerHTML = "";
  forecastContainer.append(headingCol);
  for (var i = 0; i < fiveDayForecast.length; i++) {
    if (fiveDayForecast[i].dt >= start && fiveDayForecast[i].dt < end) {
      if (fiveDayForecast[i].dt_txt.slice(11, 13) == "12") {
        renderForecastCard(fiveDayForecast[i]);
      }
    }
  }
}

function renderItems(city, data) {
  renderCurrentWeather(city, data.list[0], data.city.timezone);
  renderForecast(data.list);
}

function fetchWeather(location) {
  var { lat } = location;
  var { lon } = location;
  var city = location.name;
  var apiUrl = `${rootUrl}/data/2.5/forecast?lat=${lat}&lon=${lon}&units=imperial&appid=${apiKey}`;
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      renderItems(city, data);
    })
    .catch(function (err) {
      console.error(err);
    });
}

function fetchCoords(search) {
  var apiUrl = `${rootUrl}/geo/1.0/direct?q=${search}&limit=5&appid=${apiKey}`;
  fetch(apiUrl)
    .then(function (res) {
      return res.json();
    })
    .then(function (data) {
      if (!data[0]) {
        alert("location not found");
      } else {
        addSearchHistory(search);
        fetchWeather(data[0]);
      }
    })
    .catch(function (err) {
      console.error(err);
    });
}

const pastSearch = (city) => {
  console.log(city);
};

// todo: handle search submit (calls fetch coords)
function handleSearchSubmit(event) {
  if (!searchInput.value) {
    return;
  }
  event.preventDefault();
  var search = searchInput.value.trim();
  fetchCoords(search);
  searchInput.value = "";
}

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};

function handleHistoryClick(event) {
  if (!event.target.matches(".history-btn")) {
    return;
  }
  var btn = event.target;
  var search = btn.getAttribute("data-search");
  fetchCoords(search);
}

getSearchHistory();
// TODO: finish these functions
searchForm.addEventListener("submit", handleSearchSubmit);
searchHistoryContainer.addEventListener("click", handleHistoryClick);
