//set today date
var todayDate = moment().format("M/D/YYYY");
var todayHumidity, windSpeed, iconKey, temperature, iconURL, lat, lon;
//set a default city in case the user will enter the first time on the site
if (
  localStorage.getItem("userChoice") == null &&
  localStorage.getItem("userChoice") == undefined
) {
  localStorage.setItem("userChoice", "Austin");
}
var cityName = localStorage.getItem("userChoice");
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
if (
  localStorage.getItem("cityList") == null &&
  localStorage.getItem("cityList") == undefined
) {
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
  localStorage.setItem("cityList", cityList);
}
var returnedCityList = localStorage.getItem("cityList").split(",");
// display a list of eight cities
displayCities(returnedCityList);

// obtain the longitude and latitude of the city then return the info to display today's weather
var weatherData = $.ajax({
  url: todayWeatherURL,
  method: "GET",
});
weatherData
  .then(function (response) {
    console.log(response);
    todayHumidity = response.main.humidity;
    windSpeed = response.wind.speed;
    iconKey = response.weather[0].icon;
    temperature = ((9 / 5) * (response.main.temp - 273) + 32).toFixed(2);
    iconURL = "https://openweathermap.org/img/w/" + iconKey + ".png";
    lat = response.coord.lat;
    lon = response.coord.lon;

    return $.ajax({
      url:
        "https://api.openweathermap.org/data/2.5/uvi?lat=" +
        lat +
        "&lon=" +
        lon +
        "&appid=46e368e4530a17148527414cba27b952",
      method: "GET",
    });
  })
  .then(function (data) {
    console.log(data);

    var UVIndex = data.value;
    displayTodayWeather(
      cityName,
      todayDate,
      temperature,
      todayHumidity,
      windSpeed,
      iconURL,
      UVIndex
    );
  });

// obtain the longitude and latitude of the city then return the info to display in the next five days sections
var cityCoordData = $.ajax({
  url: todayWeatherURL,
  method: "GET",
});
cityCoordData
  .then(function (response) {
    lat = response.coord.lat;
    lon = response.coord.lon;
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
    for (let i = 0; i < 5; i++) {
      globalTime = moment().add(i + 1, "days");
      dailyDate = globalTime.format("M/D/YYYY");
      dailyTemperature = response.daily[i].feels_like.day;
      dailyHumidity = response.daily[i].humidity;
      dailyIconURL =
        "https://openweathermap.org/img/w/" +
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
  humidityOne,
  windSpeed,
  iconURL,
  UVIndex
) {
  $("#city-name").text(cityName + " (" + todayDate + ")");
  $("img").attr("src", iconURL);
  $("#temperature").text("Temperature: " + temperature + " °F");
  $("#humidity").text("Humidity: " + humidityOne + "%");
  $("#wind-speed").text("Wind Speed: " + windSpeed + " MPH");
  $("#uv-index").append($("<span id='uv-level'>" + UVIndex + "</span>"));
  if (UVIndex > 0 && UVIndex < 3) {
    $("#uv-level").css("background-color", "#7aeb7a");
  } else if (UVIndex >= 3 && UVIndex < 5) {
    $("#uv-level").css("background-color", "yellow");
  } else if (UVIndex >= 5 && UVIndex < 7) {
    $("#uv-level").css("background-color", "#ff793e");
  } else if (UVIndex >= 7 && UVIndex < 11) {
    $("#uv-level").css("background-color", "red");
  } else {
    $("#uv-level").css("background-color", "#c83eff");
  }
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
  //set history list to not being longer than 8 cities
  if (cityList.length > 8) {
    cityList.splice(8, cityList.length - 8);
  }
  for (let i = 0; i < cityList.length; i++) {
    tr = $("<tr class='table-cities'><td>" + cityList[i] + "</td></tr>");
    tr.css("text-align", "left");
    $(".cities").append(tr);
  }
}
weatherData.then;
$("#search-button").click(function (result) {
  cityName = $("#search").val();
  // check if the user inserted any text
  todayWeatherURL =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    cityName +
    "&appid=" +
    wetherAPIKey;
  if (cityName == "") {
    return;
  }

  //the code bellow checks if there is an error returned when checking for the city, and if there is an error the site should not return anything
  $.ajax({
    url: todayWeatherURL,
    method: "GET",
    success: function (result) {
      console.log(result);
      console.log(result);
      localStorage.setItem("userChoice", cityName);

      //recreate the history list
      var localList = [cityName];

      // the loop checks if the city searched by User is not repeated in the search history, and if yes delete it from there and move it on the top of search list
      for (let i = 0; i < returnedCityList.length; i++) {
        if (cityName.toLowerCase() === returnedCityList[i].toLowerCase()) {
          continue;
        } else {
          localList.push(returnedCityList[i]);
        }
      }
      localStorage.setItem("cityList", localList);
      window.open("index.html", "_self");
    },
    error: function (xhr, status, error) {
      console.log(xhr, status, error);
      localStorage.setItem("userChoice", returnedCityList[0]);
      window.open("index.html", "_self");
    },
  });
});

$("td").click(function () {
  chosenCity = $(this)[0].innerText;
  localStorage.setItem("userChoice", chosenCity);
  window.open("index.html", "_self");
});
