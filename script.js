//Initial list of cities
var cities = [30301, 73301, 60601, 43210, 80220, 10001, 32801, 94102, 98101];

var cityNames = [
  "Atlanta",
  "Austin",
  "Chicago",
  "Columbus",
  "Denver",
  "New York",
  "Orlando",
  "San Francisco",
  "Seattle",
];

var currentDay = $("h2");
var now = moment().format("dddd, MMMM Do YYYY");
currentDay.text(now);

// Function for displaying zip code data
function renderButtons() {
  // Ensuring no duplicate buttons

  $("#buttons-view").empty();

  // Looping through the array of zip codes
  for (var i = 0; i < cities.length; i++) {
    // Then dynamicaly generating buttons for each zip code in the array

    var buttons = $("<button>");
    // Adding a class of city-btn to our button
    buttons.addClass("city-btn");
    // Adding a data-attribute
    buttons.attr("data-name", cities[i]);
    // Providing the initial button text
    buttons.text(cityNames[i]);
    // Adding the button to the buttons-view div
    $("#buttons-view").append(buttons);
    
  }
}
//Call render buttons to display the set city buttons
renderButtons();

//Create a function to searach based on zip code to retrieve current weather data

function citySearch(zip) {
  
  var queryURL =
    "https://api.openweathermap.org/data/2.5/weather?zip=" +
    zip +
    "&appid=af365a15708e5fc672bcd55e78617a9f";

  // Create an AJAX call for the specific zip code entered
  $.ajax({
    url: queryURL,
    method: "GET",
  }).then(function (response) {
    //Grab the div to hold the data

    var cityData = $("#searchedCity");

    //Empty the div
    cityData.empty();

    var cityName = response.name;

    var cityDisplay = $("<h3>").text(cityName);
    cityData.append(cityDisplay);

    //Store the retrieved data and set it on the div

    var temp = response.main.temp;
    //convert temp

    var celsius = temp - 273;

    // Calculating Fahrenheit temperature to the nearest integer
    var fahrenheit = Math.floor(celsius * (9 / 5) + 32);

    var pTemp = $("<p>").text("Current Temperature: " + fahrenheit + " F");
    //Display the temp
    cityData.append(pTemp);

    var humidity = response.main.humidity;
    var pHumidity = $("<p>").text("Humidity: " + humidity + " %");
    //Display the humidity
    cityData.append(pHumidity);

    var windSpeed = response.wind.speed;
    var pWindSpeed = $("<p>").text("Wind Speed: " + windSpeed + " MPH");
    //Display the Wind Speed
    cityData.append(pWindSpeed);

    //Get lat and long coordinates

    var lat = response.coord.lat;
    var long = response.coord.lon;

    //Call the uvIndex function to display on page.

    uvIndex(lat, long);
    fiveDayForecast(lat, long);
  });
}

//A function to makes an ajax call to the API for uv Index with the lat and long coordinates from the citySearch function

function uvIndex(lat, long) {
  var uvQueryURL =
    "http://api.openweathermap.org/data/2.5/uvi?lat=" +
    lat +
    "&lon=" +
    long +
    "&appid=af365a15708e5fc672bcd55e78617a9f";

  $.ajax({
    url: uvQueryURL,
    method: "GET",
  }).then(function (response) {
    var cityData = $("#searchedCity");

    //Take the uv Index response

    var uvIndex = response.value;

    //Add it to the div

    var pUV = $("<p>").text("UV Index: " + uvIndex);
    cityData.append(pUV);
  });
}

function fiveDayForecast(lat, long) {
  var fiveDayURL =
    "https://api.openweathermap.org/data/2.5/onecall?lat=" +
    lat +
    "&lon=" +
    long +
    "&appid=af365a15708e5fc672bcd55e78617a9f";

  $.ajax({
    url: fiveDayURL,
    method: "GET",
  }).then(function (response) {
    for (var i = 1; i < 6; i++) {
      var forecastCard = $("#card" + i);
      var dayForecast = response.daily[i].weather[0].main;
      var dayOfWeek = moment().add(i, "days").format("dddd");
      var dateText = $("<p>").text(dayOfWeek);
      var forecastText = $("<p>").text("Forecast " + dayForecast);
      forecastCard.empty();
      forecastCard.append(dateText);
      forecastCard.append(forecastText).addClass("card");
    }
  });
}

// Adding a click event listener to all elements with a class of "city-btn"
$(document).on("click", ".city-btn", function(event){
  for (var i = 0; i <cities.length; i++){
    var eachZip = $(this).attr("data-name");
  }
  citySearch(eachZip)
});

//Add event listener for the search button to display the searched city
var searchButton = $("#searchButton").on("click", function(event) {
  event.preventDefault();
  // This line grabs the input from the textbox
  var city = $(".form-control").val().trim()
  //Call the city search function
  citySearch(city);
});
