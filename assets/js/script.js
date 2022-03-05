// Get form element value
let leftColumnEL = document.querySelector("#left-column")



let citiesListContainerBtnEl = document.querySelector(".list-group-item");
// Daily forcast Containter
let dailyWeatherContainerEl = document.querySelector("#forecast-output-container");


// Create a form container and containing elements
let dynFormContainer = document.createElement("form");
dynFormContainer.setAttribute("id", "dymCityForm");
dynFormContainer.classList = "city-search-forecast-container";
leftColumnEL.appendChild(dynFormContainer)


// Create H3 element
let formH3 = document.createElement("h3");
formH3.textContent = " Search for a City ";
dynFormContainer.appendChild(formH3);

// Create input element
let formInput = document.createElement("input");
formInput.setAttribute("id", "city-name")
formInput.setAttribute("type", "text");
formInput.setAttribute("autofocus", "true");
formInput.classList = "form-input";
dynFormContainer.appendChild(formInput);

// Create button element
let formButton = document.createElement("button");
formButton.setAttribute("type", "submit");
formButton.classList = ("btn fas fa-search");
dynFormContainer.appendChild(formButton);

// Find the city form
let seachEventHanglerEl = document.querySelector("#dymCityForm");
let searchByCityEl = document.querySelector("#city-name");


// Left column cities container
let citiesContainerEl = document.createElement("div");
citiesContainerEl.setAttribute("id", "dym-cities-list");
citiesContainerEl.classList = "list-group";

// Append to the left column
leftColumnEL.appendChild(citiesContainerEl);

// Find the list div container
let citiesListContainerEl = document.querySelector("#dym-cities-list");



var populateSavedCities = function () {
    // Get array from local storage
    let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    // City exist or not. 0 = not, 1 = yes
    let cityExist = 0;

    if (citiesLocalStorage === null) {
    } else {

        $(".list-group-item").remove(); // Remove all list items from the document with jquery

        for (i = 0; i < citiesLocalStorage.length; i++) {

            // Populate the cities as anchors and add necessary attribures and classes.
            let cityNameEl = document.createElement("a")
            let splitCityText = "";
            cityNameEl.setAttribute("href", "#")
            cityNameEl.setAttribute("data-city", citiesLocalStorage[i]);
            cityNameEl.setAttribute("id", citiesLocalStorage[i]);
            cityNameEl.setAttribute("role", "button");
            cityNameEl.classList = "list-group-item list-group-item-action list-group-item-primary";
            cityNameEl.textContent = citiesLocalStorage[i];
            //citiesListContainerEl.appendChild(cityNameEl);
            // dynContainer
            citiesContainerEl.appendChild(cityNameEl);
        };
       
    };
};


function fetchSecondCall(searchByCity, latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed) {

    // Assign API URL
    let openWeatherApiFiveDayUrl = "https://api.openweathermap.org/data/2.5/onecall?lat=" + latNum + "&lon=" + lonNum + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial"

    fetch( 
        openWeatherApiFiveDayUrl
    )
        .then(function (response) {
            return response.json();
        })
        .then(function (secondCallData) {
            // *** Current Day data *** //
            // Current Day UV
            let uvIndex = secondCallData.current.uvi
         

            let unix_timestamp = unixTimeCurrentDay;
            var date = new Date(unix_timestamp * 1000);
            // Hours part from the timestamp
            var year = date.getFullYear(); // Year format to be used
            var monthOfYear = date.getMonth() + 1; // month Jan =0, then +1 for actual January for display
            var dayOfMonth = date.getDate();
            var fullDayDaily = "(" + (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear() + ")";

            // Populate current day data
            populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex);

            // Populate 5 day forcast
            populate5DayForecast(secondCallData)
        });
};

// Function to populate current day forecast
function populateCurrentDayHtml(searchByCity, fullDayDaily, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed, uvIndex) {
    // Populate current Day html elements
    let dailyForecastContainerEl = document.createElement("div");
    dailyForecastContainerEl.setAttribute("id", "daily-forecast-container");
    dailyForecastContainerEl.classList = "borderDiv";

    let currentDayTitle = document.createElement("h3");
    currentDayTitle.textContent = (searchByCity.charAt(0).toUpperCase() + searchByCity.slice(1) + " " + fullDayDaily);

    let currentIconEl = document.createElement("span")
    // "<i class='fas fa-check-square status-icon icon-success'></i>"
    let currentIconSymbol = "http://openweathermap.org/img/wn/" + currentDayIcon + "@2x.png";
    // alert(currentIconSymbol);
    currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
    currentDayTitle.append(currentIconEl)

    // Create p elements to hold the rest of current day informatino
    let currentTempEl = document.createElement("p");
    let currentHumidityEl = document.createElement("p");
    let currentWinSpEl = document.createElement("p");
    let currentUvIEl = document.createElement("p");

    currentTempEl.textContent = "Temperature: " + (currentTempImperial.toFixed(1)) + " °F";
    currentHumidityEl.textContent = "Humidity: " + currentHumidity + "%";
    currentWinSpEl.textContent = "Wind Speed: " + currentMPS + " MPH";
    currentUvIEl.textContent = "UV Index: " + uvIndex;

    $("#daily-forecast-container").remove(); // Remove all list items from the document with jquery

    dailyWeatherContainerEl.appendChild(dailyForecastContainerEl);
    dailyForecastContainerEl.appendChild(currentDayTitle);
    dailyForecastContainerEl.appendChild(currentTempEl);
    dailyForecastContainerEl.appendChild(currentHumidityEl);
    dailyForecastContainerEl.appendChild(currentWinSpEl);
    dailyForecastContainerEl.appendChild(currentUvIEl);
};


function populate5DayForecast(secondCallData) {

    $("#weekly-forecast-container").remove(); // Remove all list items from the document with jquery

    // Populate current Day html elements
    let weeklyForecastContainerEl = document.createElement("div");
    weeklyForecastContainerEl.setAttribute("id", "weekly-forecast-container");
    //weeklyForecastContainerEl.classList = "borderDiv";
    weeklyForecastContainerEl.classList = "border-Div-right-column";

    let fiveDayForecast = document.createElement("h3");
    fiveDayForecast.textContent = "5-Day Forecast:"

    // Append as topmost before for loop to generate contents of each div container.
    dailyWeatherContainerEl.appendChild(weeklyForecastContainerEl);
    weeklyForecastContainerEl.appendChild(fiveDayForecast);

    // Create a div just to hold the 5 day as a flex row 
    let weeklyFlexContainerEL = document.createElement("div");
    weeklyFlexContainerEL.classList = "weekly-flex-conatiner"

    // Append only after the date on the 5 Day Forecast
    weeklyForecastContainerEl.appendChild(weeklyFlexContainerEL);

    for (i = 1; i <= 5; i++) { // Get 5 days worth of conent from the 5 day forecast.
        let unixTime = secondCallData.daily[i].dt;
        //console.log("Correct 5 day forcast" + unixTime)

        let unix_timestamp = unixTime;
        // Create a new JavaScript Date object based on the timestamp
        // multiplied by 1000 so that the argument is in milliseconds, not seconds.
        var date = new Date(unix_timestamp * 1000);
        // Hours part from the timestamp
        var year = date.getFullYear();
        var monthOfYear = date.getMonth() + 1;
        var dayOfMonth = date.getDate();

        // Values to be displayed
        var fullDay = (date.getMonth() + 1) + "/" + date.getDate() + "/" + date.getFullYear(); // Date
        var iconWeather = secondCallData.daily[i].weather[0].icon // icon
        let fahrenheitTemp = secondCallData.daily[i].temp.day // Temp @ fahrenheit
        let humidity = secondCallData.daily[i].humidity;

        let eachDayContainer = document.createElement("div");
        eachDayContainer.setAttribute("id", ("day=" + [i]));
        eachDayContainer.classList = "border-div-five-day-forecast";

        let currentDayTitle = document.createElement("p");
        currentDayTitle.textContent = (fullDay);

        // Span to hold the icon
        let iconSpan = document.createElement("p");
        iconSpan.textContent = "";

        let currentIconEl = document.createElement("span")
        let currentIconSymbol = "http://openweathermap.org/img/wn/" + iconWeather + "@2x.png";
        // alert(currentIconSymbol);
        currentIconEl.innerHTML = "<img src=" + currentIconSymbol + "></img>";
        iconSpan.append(currentIconEl)

        // Create p elements to hold the rest of current day informatino
        let currentTempEl = document.createElement("p");
        let currentHumidityEl = document.createElement("p");

        currentTempEl.textContent = "Temperature: " + (fahrenheitTemp.toFixed(2)) + " °F";
        currentHumidityEl.textContent = "Humidity: " + humidity + "%";

        eachDayContainer.appendChild(currentDayTitle);
        eachDayContainer.appendChild(currentIconEl);
        eachDayContainer.appendChild(currentTempEl);
        eachDayContainer.appendChild(currentHumidityEl);
        weeklyFlexContainerEL.appendChild(eachDayContainer);
    };
};

var getWeatherData = function (event, cityClicked) {
    event.preventDefault()

    if (cityClicked) {
        
        var searchByCity = cityClicked.trim();
        /
    } else { 
      
        var searchByCity = searchByCityEl.value.trim();
        
    };

    // If field emtpy to not fetch any data
    if (searchByCity == "") {
        alert("Please do not leave city name blank");
        searchByCityEl.value = "";
        return
    } else {  // Field is not empty, lets clear it and proceed
        searchByCityEl.value = "";
    };

    // Get array from local storage
    let citiesLocalStorage = JSON.parse(localStorage.getItem("savedCities"));

    // City exist or not. 0 = not, 1 = yes
    let cityExist = 0;

    // Check if array is null and create new one again.
    if (citiesLocalStorage === null) {
        citiesSearched = new Array();
        //console.log("new array craeted");
    } else { // Assign the localStorage values to new (array), not a reference
        citiesSearched = citiesLocalStorage;
        //console.log("Values from local Storage are: " + citiesSearched);
    };

    // First API call to get latitude and longitude for the oncall api
    let openWeatherApiUrl = "https://api.openweathermap.org/data/2.5/weather?q=" + searchByCity + "&appid=32a27c42260b02de3ba5e1466def4861&units=imperial";

    fetch(  // Make a fetch request to Wikipedia to get a random article title
        openWeatherApiUrl
    ).then(function (weatherResponse) {

        if (weatherResponse.ok) {
            return weatherResponse.json();
        } else {
            // Any other response like 400 500 will display the error.
            window.alert("Error: " + weatherResponse.statusText + "\nPlease re-enter a valid city");
            // Clear the input parameter from the user
            searchByCityEl.value = "";
            return;
        }
    }).then(function (weatherLatLon) {
        // *** Current day Data *** //
        let latNum = weatherLatLon.coord.lat;
        let lonNum = weatherLatLon.coord.lon;
        let unixTimeCurrentDay = weatherLatLon.dt
        let currentDayIcon = weatherLatLon.weather[0].icon // Icon for the current day
        let currentTempImperial = weatherLatLon.main.temp // Temperature 
        let currentHumidity = weatherLatLon.main.humidity // Humidity
        let currentMPS = weatherLatLon.wind.speed
        let mphWindSpeed = Math.round(currentMPS * 2.237) // MPH


        // Add the sucessful api call city to the local storage.
        // Validate if city is new.
        for (i = 0; i < citiesSearched.length; i++) {
            if (searchByCity.toLowerCase() === citiesSearched[i].toLowerCase()) {
                //console.log("city " + citiesSearched[i] + "already exist in array")
                cityExist = 1
                break;
            };
        };

        if (cityExist === 0) {
            // Take a word and coverted to capitalizaion case --> Credits to https://stackoverflow.com/questions/32589197/how-can-i-capitalize-the-first-letter-of-each-word-in-a-string-using-javascript
            //  – Patrick Michaelsen
            citiesSearched.push(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '));

            // Save to local storage
            localStorage.setItem("savedCities", JSON.stringify(citiesSearched));
        }

        // Pass all the information already gathered for the 5 day forecast and the html build
        // Pass searchByCity to the second call as capitalized case
        fetchSecondCall(searchByCity.toLowerCase().split(' ').map(word => word.charAt(0).toUpperCase() + word.substring(1)).join(' '), latNum, lonNum, unixTimeCurrentDay, currentDayIcon, currentTempImperial, currentHumidity, currentMPS, mphWindSpeed);


        populateSavedCities();
    }).catch(function (error) {
        return;
    });

};

// Event listener for searching manually and clicking the magnifiying glass.
seachEventHanglerEl.addEventListener("submit", getWeatherData);

// Funciton to handle the event from the list of cities when clicked.
var cityClicked = function (event) {

    let cityClicked = event.target.getAttribute("data-city")
    if (cityClicked) {
        getWeatherData(event, cityClicked);
        //alert(cityClicked)
    } else { // If the value is empty, it should not happen but it is a failsafe.
        alert("Internal erro found, please email esroleo@gmail.com.\nPlease provide story of issue in order for it to be fixed");
    };
};


citiesContainerEl.addEventListener("click", cityClicked)


populateSavedCities();




