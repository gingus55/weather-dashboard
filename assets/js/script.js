console.log("howdy planet");
const myAPIKey = "f23ee9deb4e1a7450f3157c44ed020e1";
const currentWeather = $("#current-weather");
const searchContainer = $("#search-history");

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
        <li class="custom">Temperature: ${data.main.temp}</li>
        <li class="custom">Humidity: ${data.main.humidity}</li>
        <li class="custom">Wind Speed: ${data.wind.speed}</li>
        <li class="custom">UV</li>
      </ul>
  </div>`;
};

const renderTodaysWeather = function (data) {
  currentWeather.empty();
  const topBlock = constructTodaysWeather(data);
  currentWeather.append(topBlock);
};

const constructForecast = function () {
  console.log("forecast constructed");
};

const renderForecast = function () {
  console.log("forecast rendered");
  //   construct and append forecast
  constructForecast();
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
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=` +
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
        // render forecast
        renderForecast(data);

        // get data for forecast fetch

        const forecastURL = `https://api.openweathermap.org/data/2.5/onecall?lat=${data.coord.lon}&lon=${data.coord.lon}&exclude={part}&appid=${myAPIKey}`;
        console.log(forecastURL);
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
  //   renderSearchHistory();
  //   // render top search history details
  //   renderTodaysWeather();
  //   renderForecast();

  $("#submit").on("click", handleClick);
};

window.addEventListener("load", onLoad);

