$(document).foundation();
var todayDate = moment().format("M[/],D[/],YYYY");
var cityName = "columbus";
var wetherAPIKey = "46e368e4530a17148527414cba27b952";
var todayWeatherURL =
  "https://api.openweathermap.org/data/2.5/weather?q=" +
  cityName +
  "&appid=" +
  wetherAPIKey;
var fiveDayForecastUrl =
  "https://api.openweathermap.org/data/2.5/forecast/daily?q=" +
  cityName +
  "&cnt=5&appid=" +
  wetherAPIKey;

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
  });

$.ajax({
  url: fiveDayForecastUrl,
  method: "GET",
}).then(function (response) {
  console.log(response);
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
