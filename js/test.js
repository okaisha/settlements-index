	var geoCountries = countries.responseJSON;
	console.log(geoCountries.features.length); 


	for (var i = 0; i < geoCountries.features.length; i++) { //loop through countries and add an oced marker
			var oedc_1 = [12,19,35,55,77,87,91,102,62,109,135,165,166,181,205,210,213,224,230,232];	
			var oedc_2 = [11,42,68,64,70,101,108,112,123,129,130,156,172,179,132,200];	

			if (oedc_1.includes(i)) {
				geoCountries.features[i].properties.OECD = "OECD 1";
			} else if (oedc_2.includes(i)) {
				geoCountries.features[i].properties.OECD = "OECD 2";
			} else {
				geoCountries.features[i].properties.OECD = "Non OECD";
			}				
		}		


	for (var i = 0; i < geoCountries.features.length; i++) { //loop through countries and add styles

	var feature = geoCountries.features[i];	
	
	function getColor() {
		return feature.properties.OECD === "OECD 1" ? "#D780A7" :
			   feature.properties.OECD === "OECD 2" ? "#8090D7" :
			   										  "";
	}

	function style() {
    return {
        fillColor: getColor(),
        weight: 1.5,
        opacity: 0.8,
        color: getColor(),
        fillOpacity: 0.25
	    };
	}
	
	
	if (feature.properties.OECD !== "Non OECD") { //add countries with styles to map
		L.geoJSON(feature, {
				style: style
			}).addTo(myMap);
		}
	
	}


	var oecdArray = [11,12,19,35,42,68,55,64,70,77,87,91,101,102,62,108,109,112,123,129,130,135,156,165,172,166,179,181,132,200,205,210,213,224,230,232];
	for (var j = 0; j < oecdArray.length; j++) {
		var i = oecdArray[j];}

////////////////////////////////////////////////////////////


var OPEN_WEATHER_MAP_API = "https://circuits-api.generalassemb.ly/8737fcf3-6a39-4548-a324-209d535e59fd?q=";
var resultElement = $('#result');

function callOpenWeatherMap(city) {
  if(city.length === 0) {
  $("#result").html("Please enter a city name into the search field"); //Adds/updates texts in the div
  } else {
  $.get(OPEN_WEATHER_MAP_API + city, function(searchResult){
  //console.log(searchResult.main.temp);  
  var stringOutput;
  var celsiusTemp = toCelsius(searchResult.main.temp);
  stringOutput = "<p>"+ searchResult.name + "<br>";
  stringOutput += "<p>" + celsiusTemp + " C" + "<br>"; 
  stringOutput +="</p>";   
  resultElement.html(stringOutput);
  });
  }
}

function toCelsius(kelvinTemp) {
  var temp = Math.round(kelvinTemp - 273.15);
  return temp;
}

$('#searchBtn').on('click',function(e){
  e.preventDefault();
  callOpenWeatherMap($('#searchField').val());
});

//////////////////////// Zoom Levels
				if(currentZoom <= 2){
					layer.setRadius(radius[i]);
				
				} else if(currentZoom === 3){
					if(classes[i] === "megalopolis" | classes[i] === "metropolis" | classes[i] === "largeCity") {
						layer.setRadius(radius[i] * 2);
					} else {
						layer.setRadius(1);
					}
				
				} else if(currentZoom === 4){
					if(classes[i] === "megalopolis" | classes[i] === "metropolis" | classes[i] === "largeCity") {
						layer.setRadius(radius[i] * 3);
					} else { 
						layer.setRadius(1);
					}
				
				} else if (currentZoom === 5){
					if(classes[i] === "megalopolis" | classes[i] === "metropolis" | classes[i] === "largeCity"){
						layer.setRadius(radius[i] * 4)
					} else if (classes[i] === "city") {
						layer.setRadius(3);
					} else if (classes[i] === "largeTown") {
						layer.setRadius(2);
					} else {
						layer.setRadius(1);
					}
				
				} else if (currentZoom >= 6) {
					if(classes[i] === "megalopolis" | classes[i] === "metropolis" | classes[i] === "largeCity"){
						layer.setRadius(radius[i] * 5)
					} else if (classes[i] === "city") {
						layer.setRadius(4);
					} else if (classes[i] === "largeTown") {
						layer.setRadius(3);
					} else {
						layer.setRadius(2);
					}
				}

//////////////////////////////////
	<div id="infoid">

			<p id="title">What Is Settlement Hierarchy?</p>
			<p id="USA" class="hierInfo">Settlement hierarchy is ...</p>
			
		</div>




















