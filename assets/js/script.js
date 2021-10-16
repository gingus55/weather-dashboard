console.log("howdy planet");

const getHistoryFromLS = function () {
  console.log("retrieved history");
  //   pull from LS
};

const constructSearchHistory = function () {
  console.log("history constructed");
  //   construct history buttons

  // append buttons to search history
};

const renderSearchHistory = function () {
  console.log("history rendered");
  //   get history data from LS
  getHistoryFromLS();
  //construct history button and append to search history
  constructSearchHistory();
};

const constructTodaysWeather = function () {
  console.log("todays weather constructed");
};

const renderTodaysWeather = function () {
  console.log("todays weather rendered");
  //   construct todays weather and append
  constructTodaysWeather();
};

const constructForecast = function () {
  console.log("forecast constructed");
};

const renderForecast = function () {
  console.log("forecast rendered");
  //   construct and append forecast
  constructForecast();
};

const handleClick = function (event) {
  console.log("click");
  //   get value from search input
  const searchBox = $("#city-input");
  const city = searchBox.val();
  console.log(city);
};

const onLoad = function () {
  //   render search history
  renderSearchHistory();
  // render top search history details
  renderTodaysWeather();
  renderForecast();

  $("#submit").on("click", handleClick);
};

window.addEventListener("load", onLoad);

