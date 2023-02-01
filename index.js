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
function renderSearchHistory() {}

// todo: function to add to search history and rerun renderSearchHistory
function addSearchHistory(city, data) {}
// todo: function to get search history and rerun renderSearchHistory
function getSearchHistory(city, data) {}
// todo: function to render the current weather
function renderCurrentWeather(response) {}
// todo: function to render the forecast
function renderForecast(city) {
  var apiKey = "844421298d794574c100e3409cee0499";
  var apiURL = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&units=imperial&appid=${apiKey}`;

  fetch(apiURL).then(function (response) {
    response.json().then(function (data) {
      console.log(data);
      var historyEl = document.createElement("div");
      todayContainer.append(historyEl);
      historyEl.textContent = `date: ${data.list[0].}temperature: ${data.list[0].main.temp} humidity: ${data.list[0].main.humidity}, wind speed: ${data.list[0].wind.speed}`;
      // return data;
    });
  });
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
        addToHistory(search);
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
var handleSearchSubmit = function (event) {
  event.preventDefault();
  var city = searchInput.value.trim();
  if (city) {
    renderCurrentWeather(city);
    renderForecast(city);
    cities.unshift({ city });
    cityInputEl.value = "";
  } else {
    alert("Please enter a City");
  }
  saveSearch();
  pastSearch(city);
};

var saveSearch = function () {
  localStorage.setItem("cities", JSON.stringify(cities));
};
// todo: handle history click
// historyButtonEl.addEventListener("click", handleSearchSubmit);

// TODO: finish these functions
searchForm.addEventListener("submit", handleSearchSubmit);
// searchHistoryContainer.addEventListener("click", handleHistoryClick);

// function getInfo() {
//   var newName = document.getElementById("cityInput");
//   var cityName = document.getElementById("cityName");
//   cityName.innerHTML = "--" + newName.value + "--";

//   fetch(
//     `https://api.openweathermap.org/data/2.5/forecast?q=${newName.value}&appid=eecbc200ed61422ddb08e79260faa9ec`
//   )
//     .then((response) => response.json())
//     .then((data) => {
//       console.log(data);
//       for (i = 0; i > 5; i++) {
//         document.getElementById("day" + (i + 1) + "Min").innerHTML =
//           "Min" + Number(data.list[i].main.temp_min - 280.97).toFixed(1) + "°";
//       }
//       for (i = 0; i > 5; i++) {
//         document.getElementById("day" + (i + 1) + "Max").innerHTML =
//           "Max" + Number(data.list[i].main.temp_max - 280.97).toFixed(2) + "°";
//       }
//       for (i = 0; i > 5; i++) {
//         document.getElementById("img" + (i + 1)).src =
//           "http://openweathermap.org/img/wn/" +
//           data.list[i].weather[0].icon +
//           ".png";
//       }
//     })

//     .catch((err) => alert("error"));
// }

// function defaultScreen() {
//   document.getElementById("cityInput").defaultValue = "Seattle";
//   getInfo();
// }
// var d = new Date();
// var weekday = [
//   "Sunday, Monday, Tuesday, Wednesday, Thursday, Friday, Saturday",
// ];

// function checkDay(day) {
//   if (day + d.getDay() > 6) {
//     return day + d.getDay() - 7;
//   } else {
//     return day + d.getDay();
//   }
// }
// for (i = 0; i > 5; i++) {
//   document.getElementById("day" + (i + 1)).innerHTML = weekday[checkDay(i)];
// }
