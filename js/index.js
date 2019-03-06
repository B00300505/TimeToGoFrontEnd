window.onload = function(){
	var searchedFlight = new flightClass("", "", "", "", "", "", "", "")
}



//Show or Hide the nav bar
function navBarScript() {
	const navBarDiv1 = document.getElementById("navbar1");
	const navBarDiv2 = document.getElementById("navbar2");
	const navBarDiv3 = document.getElementById("navbar3");
	const navBarDiv4 = document.getElementById("navbar4");
	const navBarDiv5 = document.getElementById("navbar5");
	const navBarDiv6 = document.getElementById("navbar6");

	if (navBarDiv1.style.display === "none") {
		navBarDiv1.style.display = "block";
		navBarDiv2.style.display = "block";
		navBarDiv3.style.display = "block";
		navBarDiv4.style.display = "block";
		navBarDiv5.style.display = "block";
		navBarDiv6.style.display = "block";
	} else {
		navBarDiv1.style.display = "none";
		navBarDiv2.style.display = "none";
		navBarDiv3.style.display = "none";
		navBarDiv4.style.display = "none";
		navBarDiv5.style.display = "none";
		navBarDiv6.style.display = "none";
	}
};


//Search Code
//Takes the input date and gets a list of airports
function getAirports(){
	const airportDiv = document.getElementById("airportDiv");
	const departureDiv = document.getElementById("departureAirportOptions");
	const arrivalDiv = document.getElementById("arrivalAirportOptions");
	
	var flighDate = document.getElementById("flightDate").value;
	
	var departureList = ["Any", "New York"];
	var arrivalList = ["Any", "Glasgow"];
	var departureOptions = "";
	var arrivalOptions = "";
	
	airportDiv.style.display = "block"; // Shows the airport selection dropdown menus
	
	//Loads data into dropdown menus
	var i;
	for (i = 0; i < departureList.length; i++) {
		departureOptions += "<option>"+departureList[i]+"</option>";
	};
	for (i = 0; i < arrivalList.length; i++) {
		arrivalOptions += "<option>"+arrivalList[i]+"</option>";
	};
	
	departureDiv.innerHTML = departureOptions;
	arrivalDiv.innerHTML = arrivalOptions;
	
};

//Takes the input airports and returns a list of flights
function getFlights(){
	const flightDiv = document.getElementById("flightDiv");
	const flightOptionsDiv = document.getElementById("flightOptions");
	
	var departureAirport = document.getElementById("departureAirportOptions").value;
	var arrivalAirport = document.getElementById("arrivalAirportOptions").value;
	
	var flights = ["None", "Flight X"];
	var flightcode = ["123", "ABC"]
	var flightOptions = "";
	
	flightDiv.style.display = "block";
	
	for (i = 0; i < flights.length; i++) {
		flightOptions += "<option value='"+flightcode[i]+"'>"+flights[i]+"</option>";
	};
	
	flightOptionsDiv.innerHTML = flightOptions;
};

//Takes the chosen flight code and loads the matching flight into the flight page.
function loadFlight(){
	var flightcode = document.getElementById("flightOptions").value;
	
	var scheduledArrivalTime = new Date("May 20, 2019 15:00:00")
	var predictedArrivalTime = new Date("May 20, 2019 14:30:00")
	
	searchedFlight = new flightClass("", "Flight NY to GB", "Swift Airlines", "New York", "Glasgow", 55.8690774, -4.4372416, scheduledArrivalTime, predictedArrivalTime, "Just some directions");
	
	searchedFlight.loadFlight();
	
	getLocation();
}

//clears the search page
function clearSearch() {
	const airportDiv = document.getElementById("airportDiv");
	const departureDiv = document.getElementById("departureAirportOptions");
	const arrivalDiv = document.getElementById("arrivalAirportOptions");
	const flightDiv = document.getElementById("flightDiv");
	const flightOptionsDiv = document.getElementById("flightOptions");
	
	airportDiv.style.display = "none";
	flightDiv.style.display = "none";
	
	departureDiv.innerHTML = "";
	arrivalDiv.innerHTML = "";
	flightOptionsDiv.innerHTML = "";
}


//Flightpage code
//The Class that stores info about a flight as well as the associated functions.
function flightClass (flightCode, name, companyName, departingAirport, arrivingAirport, ArrivalCoordLat, ArrivalCoordLong, scheduledArrival, predictedArrival, directions){
	this.flightCode = flightCode;
	this.name = name;
	this.companyName = companyName;
	this.departingAirport = departingAirport;
	this.arrivingAirport = arrivingAirport;
	this.arrivalCoordLat = ArrivalCoordLat;
	this.arrivalCoordLong = ArrivalCoordLong;
	this.scheduledArrival = scheduledArrival;
	this.predictedArrival = predictedArrival;
	this.directions = directions;
	
	this.loadFlight = function(){ //Loads flight info into the flight page
		const flightNameDiv = document.getElementById("flightName");
		const flightCompanyDiv = document.getElementById("flightCompany");
		const departingFromDiv = document.getElementById("departingFrom");
		const arrivingAtDiv = document.getElementById("arrivingAt");
		const scheduledArrivalDiv = document.getElementById("scheduledArrival");
		const predictedArrivalDiv = document.getElementById("predictedArrival");
		const drivingInstructionsDiv = document.getElementById("drivingInstructions");
		
		flightNameDiv.innerHTML = this.name;
		flightCompanyDiv.innerHTML = this.companyName;
		departingFromDiv.innerHTML = this.departingAirport;
		arrivingAtDiv.innerHTML = this.arrivingAirport;
		scheduledArrivalDiv.innerHTML = this.scheduledArrival;
		predictedArrivalDiv.innerHTML = this.predictedArrival;
		drivingInstructionsDiv.innerHTML = this.directions;
		
		flightTimer("flightTimer", this.predictedArrival.getTime());
	}
}

//The script for the countdown timer. From https://www.w3schools.com/howto/howto_js_countdown.asp
function flightTimer(divName, countDownDate) {
	var x = setInterval(function() {

		// Get todays date and time
		var now = new Date().getTime();
			
		// Find the distance between now and the count down date
		var distance = countDownDate - now;
			
		// Time calculations for days, hours, minutes and seconds
		var days = Math.floor(distance / (1000 * 60 * 60 * 24));
		var hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
		var minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
		var seconds = Math.floor((distance % (1000 * 60)) / 1000);
			
		// Output the result in an element with id=divName
		document.getElementById(divName).innerHTML = "Leave in " + days + "d " + hours + "h " + minutes + "m " + seconds + "s ";
			
		// If the count down is over, write some text 
		if (distance < 0) {
			clearInterval(x);
			document.getElementById(divName).innerHTML = "EXPIRED";
		}
	}, 1000);
};


//Map code
//This function 
function getLocation() { //https://www.w3schools.com/html/html5_geolocation.asp
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(loadMap);
	} else {
		alert("Geolocation is not supported by this browser.");
	}
}

function loadMap(position){ //https://www.w3schools.com/html/html5_geolocation.asp
	initMap(position.coords.latitude, position.coords.longitude, searchedFlight.arrivalCoordLat, searchedFlight.arrivalCoordLong);
	$.mobile.navigate( "#flightpage" );
	clearSearch();
}



function initMap(currentLocationLat, currentLocationLong, arrivalLocationLat, arrivalLocationLong) {//https://stackoverflow.com/questions/5959788/google-maps-api-v3-how-show-the-direction-from-a-point-a-to-point-b-blue-line
  var pointA = new google.maps.LatLng(currentLocationLat, currentLocationLong),
    pointB = new google.maps.LatLng(arrivalLocationLat, arrivalLocationLong),
    myOptions = {
      zoom: 7,
      center: pointA
    },
    map = new google.maps.Map(document.getElementById('mapDiv'), myOptions),
    // Instantiate a directions service.
    directionsService = new google.maps.DirectionsService,
    directionsDisplay = new google.maps.DirectionsRenderer({
      map: map
    }),
    markerA = new google.maps.Marker({
      position: pointA,
      title: "Current Location",
      label: "You",
      map: map
    }),
    markerB = new google.maps.Marker({
      position: pointB,
      title: "Airport",
      label: "Airport",
      map: map
    });

  // get route from A to B
  calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB);

}

function calculateAndDisplayRoute(directionsService, directionsDisplay, pointA, pointB) {//https://stackoverflow.com/questions/5959788/google-maps-api-v3-how-show-the-direction-from-a-point-a-to-point-b-blue-line
  directionsService.route({
    origin: pointA,
    destination: pointB,
    travelMode: google.maps.TravelMode.DRIVING
  }, function(response, status) {
    if (status == google.maps.DirectionsStatus.OK) {
      directionsDisplay.setDirections(response);
    } else {
      window.alert('Directions request failed due to ' + status);
    }
  });
}
