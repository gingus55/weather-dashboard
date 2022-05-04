const myAPIKey = "f23ee9deb4e1a7450f3157c44ed020e1";
const currentWeather = $("#current-weather");
const searchContainer = $("#search-history");
const forecastContainer = $("#forecast-container");

const constructSearchHistory = function (array) {
  array.forEach((element) => {
    historyButton = `<li><button id="search-btn">${element}</button></li>`;
    const searchHist = $("#search-history");
    searchHist.append(historyButton);
  });
};

const renderSearchHistory = function () {
  searchContainer.empty();
  const array = getFromLocalStorage();
  constructSearchHistory(array);
};

const constructTodaysWeather = function (data) {
  const date = moment.unix(data.dt).format("DD-MM-YYYY");

  return `<div>
    <h2>${data.name} : ${date}
        <img id="main-icon" src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">
    </h2>
    <ul class="list-group-flush">
        <li class="custom">Temperature: ${data.main.temp} <sup>O</sup>C</li>
        <li class="custom">Humidity: ${data.main.humidity} %</li>
        <li class="custom">Wind Speed: ${data.wind.speed} m/s</li>
        <li class="custom" >UV Index: <span id="uvi"></span></li>
      </ul>
  </div>`;
};

const renderTodaysWeather = function (data) {
  currentWeather.empty();
  const topBlock = constructTodaysWeather(data);
  currentWeather.append(topBlock);
};

const constructForecast = function (dailyArray) {
  dailyArray.forEach((element) => {
    const date = moment.unix(element.dt).format("dddd-MM-YYYY");
    forecastBlock = `<div class="card col-2 padstyle" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${date}<img class="weather-icon" src="http://openweathermap.org/img/wn/${element.weather[0].icon}.png" alt="..."></h5>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temperature: ${element.temp.day} <sup>O</sup>C</li>
      <li class="list-group-item">Humidity: ${element.humidity} %</li>
      <li class="list-group-item">Wind speed: ${element.wind_speed} m/s</li>
    </ul>
</div>`;
    forecastContainer.append(forecastBlock);
  });
};

const renderForecast = function (dailyArray) {
  forecastContainer.empty();
  constructForecast(dailyArray);
};

const getFromLocalStorage = function () {
  const searchHistory = JSON.parse(localStorage.getItem("history")) || [];
  return searchHistory;
};

const handleResponse = function (response) {
  return response.json();
};

const showError = function () {
  const error = document.createElement("p");
  error.textContent = "please enter a valid city";
  $("#error-response").append(error);
};

const renderUviSpan = function (uviData) {
  const placeHolder = $("#uvi");
  placeHolder.text(uviData);
  if (uviData < 3) {
    placeHolder.addClass("green");
  } else if (uviData >= 3 && uviData < 8) {
    placeHolder.addClass("orange");
  } else {
    placeHolder.addClass("red");
  }
};

const renderPage = function (city) {
  const myUrl =
    `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=` +
    myAPIKey;

  const handleData = function (data) {
    if (data.cod == 200) {
      //   save city into local storage
      const searched = getFromLocalStorage();
      if (!searched.includes(data.name)) {
        searched.push(data.name);
        localStorage.setItem("history", JSON.stringify(searched));
      }

      renderSearchHistory();

      renderTodaysWeather(data);

      // get data for forecast fetch

      const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lat}&lon=${data.coord.lon}&exclude={part}&units=metric&appid=${myAPIKey}`;

      const handleSecondData = function (data) {
        const uviData = data.current.uvi;
        const dailyArray = data.daily;
        const dailyArr = dailyArray.slice(1, 6);

        renderForecast(dailyArr);
        renderUviSpan(uviData);
      };

      fetch(forecastURL).then(handleResponse).then(handleSecondData);
    } else {
      showError();
    }
  };

  fetch(myUrl).then(handleResponse).then(handleData);
};

const handleClick = function (event) {
  event.preventDefault();
  $("#error-response").empty();

  const searchBox = $("#city-input");
  const city = searchBox.val();

  if (!city) {
    showError();
  } else {
    renderPage(city);
  }
};

const onLoad = function () {
  const historyOnLoad = getFromLocalStorage();
  if (!historyOnLoad.length === 0) {
    renderSearchHistory(historyOnLoad);

    renderPage(historyOnLoad[historyOnLoad.length - 1]);
  }
  $("#submit").on("click", handleClick);
  searchContainer.on("click", handlePastClick);
};

const handlePastClick = function (event) {
  const target = event.target;
  if (target.getAttribute("id") === "search-btn") {
    const city = target.textContent;
    renderPage(city);
  }
};

window.addEventListener("load", onLoad);
