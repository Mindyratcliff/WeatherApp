//Initial list of cities
var cities = [
     30301,
     73301, 
     60601, 
     43081, 
     80012, 
     10001, 
     32801, 
     94102, 
     98101
];

// Function for displaying movie data
function renderButtons() {

    // Deleting the movies prior to adding new movies
    // (this is necessary otherwise you will have repeat buttons)
    $("#buttons-view").empty();

    // Looping through the array of movies
    for (var i = 0; i < cities.length; i++) {

      // Then dynamicaly generating buttons for each movie in the array
      // This code $("<button>") is all jQuery needs to create the beginning and end tag. (<button></button>)
      var a = $("<button>");
      // Adding a class of movie-btn to our button
      a.addClass("city-btn");
      // Adding a data-attribute
      a.attr("data-name", cities[i]);
      // Providing the initial button text
      a.text(cities[i]);
      // Adding the button to the buttons-view div
      $("#buttons-view").append(a);
    }
  }

  // This function handles events where a movie button is clicked
  $("#searchButton").on("click", function(event) {
    event.preventDefault();
    // This line grabs the input from the textbox
    var city = $(".form-control").val().trim();

    // Adding movie from the textbox to our array
    cities.push(city);

    // Calling renderButtons which handles the processing of our movie array
    renderButtons();
  });

  // Adding a click event listener to all elements with a class of "movie-btn"
  $(document).on("click", ".city-btn", citySearch);

  // Calling the renderButtons function to display the initial buttons
  renderButtons();

function citySearch (){
    var zip = $(this).attr("data-name");
    var queryURL = "https://api.openweathermap.org/data/2.5/weather?zip=" + zip + "&appid=af365a15708e5fc672bcd55e78617a9f";

    // Create an AJAX call for the specific zip code entered
        $.ajax({
          url: queryURL,
          method: "GET"
        }).then(function(response) {


            //Grab the div to hold the data

            var cityData = $("#searchedCity");

            //Empty the div
            cityData.empty();

            var cityName = response.name;

            var cityDisplay = $("<h2>").text(cityName);
            cityData.append(cityDisplay);


            //Store the retrieved data and set it on the div

            var temp = response.main.temp;
            //convert temp

            var celsius = temp - 273;

            // Calculating Fahrenheit temperature to the nearest integer
            var fahrenheit = Math.floor(celsius * (9/5) + 32);

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
            var long = response.coord.long;

            uvIndex(lat,long);

        })

        
            

};

function uvIndex (lat, long) {

    var uvQueryURL = "http//api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + long + "&appid=af365a15708e5fc672bcd55e78617a9f";

    $.ajax({

       url: uvQueryURL,
       method: "GET"
       }).then(function(response) {

           var cityData = $("#searchedCity");

           var uvIndex = response.value;

           var pUV = $("<p>").text("UV Index: " + uvIndex);
           cityData.append(pUV);


   })
}

var searchButton = $("#searchButton").on("click", citySearch);

