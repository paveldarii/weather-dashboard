$(document).foundation();
var todayDate = moment().format("M/D/YYYY");
var cityName = "New York";
var wetherAPIKey = "46e368e4530a17148527414cba27b952";
var todayWeatherURL =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  cityName +
  "&appid=" +
  wetherAPIKey;
var fiveDayForecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast/?q=" +
  cityName +
  "&appid=" +
  wetherAPIKey;
var cityList = [
  "Austin",
  "Chicago",
  "New York",
  "Orlando",
  "San Francisco",
  "Seattle",
  "Denver",
  "Atlanta",
];
displayCities(cityList);
$.ajax({
  url: todayWeatherURL,
  method: "GET",
})
  .then(function (response) {
    console.log(response);
    humidity = response.main.humidity;
    windSpeed = response.wind.speed;
    iconKey = response.weather[0].icon;
    temperature = ((9 / 5) * (response.main.temp - 273) + 32).toFixed(2);
    iconURL = "http://openweathermap.org/img/w/" + iconKey + ".png";
    lat = response.coord.lat;
    lon = response.coord.lon;

    return $.ajax({
      url:
        "http://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=46e368e4530a17148527414cba27b952",
      method: "GET",
    });
  })
  .then(function (data) {
    UVIndex = data.value;
    displayTodayWeather(
      cityName,
      todayDate,
      temperature,
      humidity,
      windSpeed,
      iconURL,
      UVIndex
    );
    return $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/onecall?lat=" +
        lat +
        "&lon=" +
        lon +
        "&exclude=hourly&units=imperial&appid=" +
        wetherAPIKey,
      method: "GET",
    });
  })
  .then(function (response) {
    console.log(response);
    for (let i = 0; i < 5; i++) {
      dailyDate = todayDate;
      dailyTemperature = response.daily[i].feels_like.day;
      dailyHumidity = response.daily[i].humidity;
      dailyIconURL =
        "http://openweathermap.org/img/w/" +
        response.daily[i].weather[0].icon +
        ".png";
      displayFiveDayWeather(
        dailyDate,
        dailyIconURL,
        dailyTemperature,
        dailyHumidity
      );
    }
  });

function displayTodayWeather(
  cityName,
  todayDate,
  temperature,
  humidity,
  windSpeed,
  iconURL,
  UVIndex
) {
  $("#city-name").text(cityName + " (" + todayDate + ")");
  $("img").attr("src", iconURL);
  $("#temperature").text("Temperature: " + temperature + " °F");
  $("#humidity").text("Humidity: " + humidity + "%");
  $("#wind-speed").text("Wind Speed: " + windSpeed + " MPH");
  $("#uv-index").text("UV Index: " + UVIndex);
}

function displayFiveDayWeather(
  dailyDate,
  dailyIconURL,
  dailyTemperature,
  dailyHumidity
) {
  section = $("<div class='cell medium-4 large-2'></div>");
  h5Date = $("<h5 class='grid-x grid-padding-x'>" + dailyDate + "</h5>");
  icon = $("<img class='grid-x grid-padding-x' src=" + dailyIconURL + ">");
  temp = $(
    "<p class='grid-x grid-padding-x'> Temp: " + dailyTemperature + " °F</p>"
  );
  humidity = $(
    "<p class='grid-x grid-padding-x'>Humidity: " + dailyHumidity + "%</p>"
  );
  section.append(h5Date);
  section.append(icon);
  section.append(temp);
  section.append(humidity);
  section.css("background-color", "#33B7FF");
  section.css("color", "white");
  section.css("margin", "10px");
  $("#five-days-forecast").append(section);
}

function displayCities(cityList) {
  for (let i = 0; i < cityList.length; i++) {
    tr = $("<tr class='table-cities'><td>" + cityList[i] + "</td></tr>");
    tr.css("text-align", "left");
    $(".cities").append(tr);
  }
}

$("#search-button").click(function () {
  var userCity = $("#search").val();
  console.log(userCity);
});

$("td").click(function () {
  console.log($(this)[0].innerText);
});
