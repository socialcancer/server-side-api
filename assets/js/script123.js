function getAllMyHtml(data) {
    // do something
  }
  function fetchSecondCall(latlng) {
    fetch(`url${latLng}`)
    .then(function (response) {
      return response.json();
    })
    .then(function (secondCallData) {
      // do something with second call data
      getAllMyHtml(secondCallData);
    });
  }
  function myFunction(city) {
    fetch(
      // Make a fetch request to Wikipedia to get a random article title
      `https://en.wikipedia.org/w/api.php?action=${city}query&format=json&list=random&rnnamespace=0&rnlimit=1&origin=*`
    )
      .then(function (weatherResponse) {
        return weatherResponse.json();
      })
      .then(function (weatherData) {
        const latLng = weatherData.latlng;
        fetchSecondCall(latLng);
      });
    console.log('something');
  }