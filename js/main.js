/////////////// Load All GeoJSON ///////////////

var cities = $.ajax({
    url: 'https://gist.githubusercontent.com/okaisha/ece04418ac04a1f46049b8381f391351/raw/e07cf4e580834df272570d2b20dcfa0df06ca82b/cities5000.geojson',
    dataType: 'json',
    success: console.log("Cities has been loaded!")
});

//If loading multiple datasets do them each separately using ajax and pass multiple variables into the when function

$.when(cities).done(function(){

	/////////////// Prepare Data ///////////////

	var geoCities = cities.responseJSON; //get the JSON response and save to variable
	var features = geoCities.features; //get city names from here

	/////////////// Find All City Names and Duplicates ///////////////

	var cityNames = []; //create an array of cities
	for(var i = 0; i < features.length; i++){
		cityNames.push(features[i].properties.city_name);
	};
	

	var citySorted = cityNames.slice().sort();                                    
	var results = [];
	
	for (var i = 0; i < citySorted.length - 1; i++) {
	    if (citySorted[i + 1] === citySorted[i]) {
	        results.push(citySorted[i]);
	    }
	};

	function unique(value, index, self) { 
	    return self.indexOf(value) === index;
	};

	var duplicates = results.filter(unique);

	/////////////// Set Default Map Views ///////////////

	var map = L.map('mapid').setView([10, 0], 2); //[y (latitude),x (longitude)] [47.28555, 11.30875], 5

	var darkLayer = L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}{r}.png', {
		attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
		subdomains: 'abcd',
		maxZoom: 19,
		updateWhenZooming: false,
		updateWhenIdle: false
	});

	map.addLayer(darkLayer);

	/////////////// Set Hierarchy Property ///////////////
	
	for (var i = 0; i < features.length; i++) {
		var pop = features[i].properties.population;

			pop >= 10000000 ? features[i].properties.hierarchy = "Megalopolis" :
			pop < 10000000 && pop >= 1000000 ? features[i].properties.hierarchy = "Metropolis" :
			pop < 1000000 && pop >= 300000 ? features[i].properties.hierarchy = "Large City" :
			pop < 300000 && pop >= 100000 ? features[i].properties.hierarchy = "City" :
			pop < 100000 && pop >= 20000 ? features[i].properties.hierarchy = "Large Town" :
			pop < 20000 && pop >= 5000 ? features[i].properties.hierarchy = "Town" :
			features[i].properties.hierarchy = "";
	};

	/////////////// Set Size and Color Functions ///////////////
	
	function getRadius(h) {
		return h === "Megalopolis" ? 3 :
			   h === "Metropolis" ? 2 :
			   h === "Large City" ? 1 :
			   h === "City" ? 1 :
			   h === "Large Town" ? 1 :
			   h === "Town" ? 1 :
			   "";
		}

	function getColor(h) {
		return h === "Megalopolis" ? "#FE37F5" :   
			   h === "Metropolis" ? "#FB5ECF" :
			   h === "Large City" ? "#F986A9" :
			   h === "City" ? "#F6AE83" :
			   h === "Large Town" ? "#F4D65D" :
			   h === "Town" ? "#F2FE37" :	
			   "";
		}

	function style(feature) {
		return {
			// Stroke properties
            color: getColor(feature.hierarchy),
            opacity: 1,
            weight: 0.25,

            // Fill properties
            fillColor: getColor(feature.hierarchy),
            fillOpacity: 0.8,

            radius: getRadius(feature.hierarchy)
		}
	}

	/////////////// Make Hierarchy Map Layers ///////////////

	var types = ["Megalopolis","Metropolis","Large City","City","Large Town","Town"]; 
	var layers = [1,2,3,4,5,6];

	for (var i = 0; i < types.length; i++) {
		layers[i] = L.geoJson(features, {
						pointToLayer: function (feature, latlng) {
						if (feature.properties.hierarchy === types[i]) {
							return L.circleMarker(latlng, style(feature.properties));
							} 
						},
						onEachFeature: function (feature, layer) {
                            layer.bindPopup("City: " + feature.properties.city_name + '<br>' + 
                            				"Country: " + feature.properties.country_1 + '<br>' + 
                            				"Population: " + feature.properties.population.toLocaleString('en') + '<br>' + 
                            				"Hierarchy Class: " + feature.properties.hierarchy);
                        },
					});
				}		
	
	var [megalopolis, metropolis, largeCity, city, largeTown, town] = layers;
	map.addLayer(city);
	map.addLayer(metropolis);
	map.addLayer(megalopolis);


	var base = {
		"Background": darkLayer
	};

	var cityOverlay = {
		"Megalopolis": megalopolis,
		"Metropolis": metropolis,
		"Large City": largeCity,
		"City": city, 
		"Large Town": largeTown,
		"Town": town
	};
	
	L.control.layers(base,cityOverlay).addTo(map);

	/////////////// Dynamically Set Radius with Zoom Level ///////////////
	
	map.on('zoomend',function(){
		var currentZoom = map.getZoom();
		console.log(currentZoom);

		var rad2 = [3,2,1,1,1,1];
		var rad3 = [6,4,2,1,1,1]; 
		var rad4 = [9,6,3,1,1,1]; 
		var rad5 = [12,8,4,3,2,1]; 
		var rad6 = [15,10,5,4,3,2];
		var classes = [megalopolis, metropolis, largeCity, city, largeTown, town];

		for(var i = 0; i < classes.length; i++){
			classes[i].eachLayer(function(layer){
				if(currentZoom <= 2){
					layer.setRadius(rad2[i]);		
				} else if(currentZoom === 3) {
					layer.setRadius(rad3[i]);		
				} else if(currentZoom === 4) {
					layer.setRadius(rad4[i]);				
				} else if (currentZoom === 5) {
					layer.setRadius(rad5[i]);
				} else if (currentZoom >= 6) {
					layer.setRadius(rad6[i]);
				}
			});
		}
	});


	/////////////// Make a Legend ///////////////
	
	var legend = L.control({position: 'bottomright'});

	legend.onAdd = function (map) {
		
		var legendDiv = L.DomUtil.create('div', 'legend');	
		legendDiv.innerHTML = '<h4 id="legend-title"><strong>Hierarchy Classes</strong></h4>';

		var labels = [
			"Megalopolis: 10mil+",
			"Metropolis: 1mil - 10mil",
			"Large City: 300k - 1mil",
			"City: 100k - 300k",
			"Large Town: 20k - 100k",
			"Town: 5k - 20k"
			];

		var colors = ["#FE37F5","#FB5ECF","#F986A9","#F6AE83","#F4D65D","#F2FE37"];
		
		for (var i = 0; i < labels.length; i++){
				legendDiv.innerHTML += '<div class="circle" style="background: ' + colors[i] + ' "></div><span class="text">' + labels[i] + '</span>' + '<br>';
			} 
		
		return legendDiv;		

	};

	legend.addTo(map);

	/////////////// Search and Clear Cities ///////////////

	var index;
	var lat;
	var lng;
	var marker;
	var markers = L.layerGroup();

	function addCity(){
		marker = L.marker([lat, lng]); 
		markers.addLayer(marker); //need to add popup with info
		map.flyTo([lat,lng],5).addLayer(markers)
	};

	function clearCities(){
		markers.clearLayers();
	}
	/* Custom Marker

	var firefoxIcon = L.icon({
        iconUrl: 'http://joshuafrazier.info/images/firefox.svg',
        iconSize: [38, 95], // size of the icon
        });
    */  
	
	function mapView(city){		
		
		//Retrieve searched city and find it's index 
		function citySearch(element) {
	  		return element === city; //element === "searchField"
		};

		index = cityNames.findIndex(citySearch);
		
		//If city is a duplicate present options and choose one
		if(duplicates.includes(city) === true) { 

			$('#result').html("Did you mean...");
			$('ul').on('click', 'li', function(e){ 
					lat = $(e.target).data("lat");
					lng = $(e.target).data("lng");
					addCity(); //gives at lat-lng error after the first marker for this part but still works

					$('#result').html("");
					$('ul').empty();

					console.log(lat + ", " + lng);
				});

			//Loop through all cities and get lat-lng of each duplicate
			for(var i = 0; i < cityNames.length; i++) { 
				if(cityNames[i] === city) {
					$('ul')
						.append('<li>' + features[i].properties.city_name + ", " + features[i].properties.country_1 + '</li>')
						.children('li:last-child')
						.addClass('.dupes')
						.data( {"lat": features[i].properties.latitude, 
								"lng": features[i].properties.longitude
							});
					}
				}
		
		} //If city exists retrieve lat-lng and fly to
		  else if (duplicates.includes(city) === false && index >= 0){
			lat = features[index].properties.latitude;
			lng = features[index].properties.longitude;
			addCity();

			$('#result').html("");

		} //If city does not exist give error message
		  else if(index === -1){
			$('#result').html(city + " was not found! <br> Please enter another city.");
		}
			
	}	


	$('#searchBtn').on('click', function(e){
		e.preventDefault();
		mapView($('#searchFld').val());

		$('#searchFld').val("Enter a city");
	});

	$('#clearBtn').on('click', function(e){
		e.preventDefault();
		clearCities();
	});
		
});

/////////////// End of Script ///////////////

