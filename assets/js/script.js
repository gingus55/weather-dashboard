console.log("howdy planet");
const myAPIKey = "f23ee9deb4e1a7450f3157c44ed020e1";
const currentWeather = $("#current-weather");

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

const constructTodaysWeather = function (data) {
  // console.log(data.weather[0].icon);
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
  console.log("todays weather rendered");
  //   construct todays weather and append
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

const getFromLocalStorage = function(){
    const searchHistory = JSON.parse(localStorage.getItem("history")) || [];
    return searchHistory;
}

const handleClick = function (event) {
  event.preventDefault();
  $("#error-response").empty();
  //   get value from search input
  const searchBox = $("#city-input");
  const city = searchBox.val();
  //   console.log(city);
  // validate value
  if (!city) {
    const error = document.createElement("p");
    error.textContent = "please enter a valid city";
    $("#error-response").append(error);
  } else {
    //   create Url
    const myUrl =
      `http://api.openweathermap.org/data/2.5/weather?q=${city}&APPID=` +
      myAPIKey;
    
    // render search history

    // handle response

    const handleResponse = function (response) {
        return response.json();
      
    };
    // handle data
    
    const handleData = function (data) {
    //   validate data
    if(data.cod==200){
        // save city into local storage
    const searched = getFromLocalStorage();
    searched.push(data.name);
    localStorage.setItem("history", JSON.stringify(searched));
    // render search history
    
       //   render todays weather
      renderTodaysWeather(data);
      // render forecast
      renderForecast(data);
    } else {
      const error = document.createElement("p");
      error.textContent = "please enter a valid city";
      $("#error-response").append(error);
    };
    };
    // make fetch request

    fetch(myUrl).then(handleResponse).then(handleData);
  }

  //   fetch current data for city

  //  fetch forecast for city
};

const onLoad = function () {
    // get data from local storage
  //   //   render search history
  //   renderSearchHistory();
  //   // render top search history details
  //   renderTodaysWeather();
  //   renderForecast();

  $("#submit").on("click", handleClick);
};

window.addEventListener("load", onLoad);

