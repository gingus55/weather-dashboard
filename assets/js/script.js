console.log("howdy planet");
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
  //   get history data from LS
  const array = getFromLocalStorage();
  //construct history button and append to search history
  constructSearchHistory(array);
};

const constructTodaysWeather = function (data) {
  const date = moment($(data.dt)).format("DD-MM-YYYY");
  return `<div>
    <h2>${data.name} : ${date}
        <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}.png">
    </h2>
    <ul class="list-group-flush">
        <li class="custom">Temperature: ${data.main.temp} <sup>O</sup>C</li>
        <li class="custom">Humidity: ${data.main.humidity}</li>
        <li class="custom">Wind Speed: ${data.wind.speed} m/s</li>
        <li class="custom">UV</li>
      </ul>
  </div>`;
};

const renderTodaysWeather = function (data) {
  currentWeather.empty();
  const topBlock = constructTodaysWeather(data);
  currentWeather.append(topBlock);
};

const constructForecast = function (dailyArray) {
    console.log(dailyArray);
  dailyArray.forEach((element) => {
      var date = moment($(element.dt)).format("DD-MM-YYYY");
    forecastBlock = `<div class="card col-2 padstyle" style="width: 18rem;">
    <div class="card-body">
      <h5 class="card-title">${date}<img src="http://openweathermap.org/img/wn/${
      element.weather[0].icon
    }.png" alt="..."></h5>
    </div>
    <ul class="list-group list-group-flush">
      <li class="list-group-item">Temperature: ${element.temp.day} <sup>O</sup>C</li>
      <li class="list-group-item">Humidity: ${element.humidity}</li>
      <li class="list-group-item">Wind speed: ${element.wind_speed} m/s</li>
    </ul>
</div>`;
    forecastContainer.append(forecastBlock);
  });
};

const renderForecast = function (dailyArray) {
  forecastContainer.empty();
  //   construct and append forecast
  constructForecast(dailyArray);
};

const getFromLocalStorage = function () {
  const searchHistory = JSON.parse(localStorage.getItem("history")) || [];
  return searchHistory;
};

const handleClick = function (event) {
  event.preventDefault();
  $("#error-response").empty();
  //   get value from search input
  const searchBox = $("#city-input");
  const city = searchBox.val();
  // validate value
  if (!city) {
    const error = document.createElement("p");
    error.textContent = "please enter a valid city";
    $("#error-response").append(error);
  } else {
    const myUrl =
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&APPID=` +
      myAPIKey;

    const handleResponse = function (response) {
      return response.json();
    };

    const handleData = function (data) {
      //   validate data
      if (data.cod == 200) {
        // save city into local storage
        const searched = getFromLocalStorage();
        if (!searched.includes(data.name)) {
          searched.push(data.name);
          localStorage.setItem("history", JSON.stringify(searched));
        }
        // render search history
        renderSearchHistory();
        //   render todays weather
        renderTodaysWeather(data);

        // get data for forecast fetch

        const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lon}&lon=${data.coord.lon}&exclude={part}&units=metric&appid=${myAPIKey}`;

        const handleSecondResponse = function (response) {
          return response.json();
        };
        // THIS IS WHERE I@M AT
        const handleSecondData = function (data) {
          const dailyArray = data.daily;
          renderForecast(dailyArray);
        };

        fetch(forecastURL).then(handleSecondResponse).then(handleSecondData);
      } else {
        const error = document.createElement("p");
        error.textContent = "please enter a valid city";
        $("#error-response").append(error);
      }
    };
    // make fetch request

    fetch(myUrl).then(handleResponse).then(handleData);
  }

  //   fetch current data for city

  //  fetch forecast for city
};

const onLoad = function () {
  // get data from local storage
  var historyOnLoad = getFromLocalStorage();
  //   //   render search history
  renderSearchHistory(historyOnLoad);
  //   renderTodaysWeather();
  //   renderForecast();

  $("#submit").on("click", handleClick);
};

window.addEventListener("load", onLoad);

