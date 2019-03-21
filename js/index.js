//Variable set up
var searchedFlight = new flightClass("", "", "", "", "", "", "", "");
var savedFlightList = [];
var timerScript = [];

window.onload = function(){
	loadSavedFlights();
	updateScript();
}





	//Code to manage saved flights
//Saves the current flight to the savedFlightList array
function saveFlight(){
	var x = savedFlightList.length
	saveDiv.style.display = "none";
	savedFlightList[x] = searchedFlight;
	loadSavedFlights();
	uploadFlights();
}
	
//Calls the loadBasic function for all the saved Flights, thus displaying them on the homepage
function loadSavedFlights() {
	const savedFlightHomepageDiv = document.getElementById("savedFlightHomepage");
	var savedFlightContent ="";
	
	//Removes old timers on the saved flights
	for(i in timerScript){
		if(i != "flightTimer"){
			clearInterval(timerScript[i]);
			console.log(i)
		}
	}
	
	for (i in savedFlightList) //https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
	{
		savedFlightContent += savedFlightList[i].loadBasic(i);
	};
	
	savedFlightHomepageDiv.innerHTML = savedFlightContent;
	if(savedFlightList.length==0){
		savedFlightHomepageDiv.innerHTML = "<h1>You have no saved Flights</h1>"
	}
	
	$('div[data-role=collapsible]').collapsible(); //https://stackoverflow.com/questions/8357756/jquery-mobile-forcing-refresh-of-content
}

//Deletes the specified flight from the array
function deleteFlight(x){
	for (i in savedFlightList) //https://stackoverflow.com/questions/1078118/how-do-i-iterate-over-a-json-structure
	{
		if(i==x){
			savedFlightList.splice(i, 1); // https://stackoverflow.com/questions/5767325/how-do-i-remove-a-particular-element-from-an-array-in-javascript
		}
		if(i > x){
			savedFlightList[i-1] = savedFlightList[i];
		}
	};

	loadSavedFlights();
	uploadFlights();
}

//Uploads the saved flight list to Firebase
function uploadFlights(){
	var user = firebase.auth().currentUser;//https://stackoverflow.com/questions/37873608/how-do-i-detect-if-a-user-is-already-logged-in-firebase
	
	var flights = savedFlightList;
	if(user != null){
		firebase.database().ref('savedFlights/' + user.uid).set({
				clear: "clear"
		});
		
		
		for(i in flights){
			console.log(flights[i])
			firebase.database().ref('savedFlights/' + user.uid+'/Flights/'+flights[i].flightCode).set({
					name: flights[i].name,
					companyName: flights[i].companyName,
					departingAirport: flights[i].departingAirport,
					arrivingAirport: flights[i].arrivingAirport,
					arrivalCoordLat: flights[i].arrivalCoordLat,
					arrivalCoordLong: flights[i].arrivalCoordLong,
					scheduledArrival: flights[i].scheduledArrival.toString(),
					predictedArrival: flights[i].predictedArrival.toString(),
					directions: flights[i].directions
			});
		}
		
	}
}

//Downloads the save flight list from Firebase
function downloadFlights(){
	var user = firebase.auth().currentUser;//https://stackoverflow.com/questions/37873608/how-do-i-detect-if-a-user-is-already-logged-in-firebase
	if(user != null){
		
		
		return firebase.database().ref('savedFlights/' + user.uid+'/Flights').once('value').then(function(snapshot) {		
			snapshot.forEach(function (childSnapshot) { //https://stackoverflow.com/questions/39820091/how-to-get-properties-values-from-snapshot-val-or-snapshot-exportval-in-fi
				var name = (childSnapshot.val() && childSnapshot.val().name)
				var companyName = (childSnapshot.val() && childSnapshot.val().companyName)
				var departingAirport = (childSnapshot.val() && childSnapshot.val().departingAirport)
				var arrivingAirport = (childSnapshot.val() && childSnapshot.val().arrivingAirport)
				var arrivalCoordLat = (childSnapshot.val() && childSnapshot.val().arrivalCoordLat)
				var arrivalCoordLong = (childSnapshot.val() && childSnapshot.val().arrivalCoordLong)
				var scheduledArrival = new Date(childSnapshot.val() && childSnapshot.val().scheduledArrival)
				var predictedArrival = new Date(childSnapshot.val() && childSnapshot.val().predictedArrival)
				var directions = (childSnapshot.val() && childSnapshot.val().directions)
				
				loadedFlight = new flightClass(childSnapshot.key, name, companyName, departingAirport, arrivingAirport, arrivalCoordLat, arrivalCoordLong, scheduledArrival, predictedArrival, directions)
				
				var duplicate = false;
//Might have to change from flightcode				
				for(i in savedFlightList){ //Checks if the loaded flight already exists in the users saved flights
					if(savedFlightList[i].flightCode == loadedFlight.flightCode){
						duplicate = true;
					}
				}
				
				//As long as no duplicates exist then the flight will be saved
				if(duplicate == false){
					var x = savedFlightList.length
					savedFlightList[x] = loadedFlight;
				}
				
			});
			loadSavedFlights();
			uploadFlights();
		});
	}
}

//This function will call flightaware to update the saved flights and current searched flight periodically.
function updateScript(){
	update5 = setInterval(function() {
		
	}, 50000);
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
	const saveDiv = document.getElementById("saveDiv");
	const saveButton = document.getElementById("SaveFlight");
		
	var flightcode = document.getElementById("flightOptions").value;
	
	var scheduledArrivalTime = new Date("May 1, 2019 15:00:00")
	var scheduledArrivalTime = new Date("May 1, 2019 14:30:00")
	
	searchedFlight = new flightClass("TestCode", "Flight NY to GB", "Swift Airlines", "New York", "Glasgow", 55.8690774, -4.4372416, scheduledArrivalTime, scheduledArrivalTime, "Just some directions");
	
	searchedFlight.loadFlight();
	
	//Sets the save button, but then removes it if the user has already saved the current flight
	saveDiv.style.display = "block";
	saveButton.setAttribute( "onClick", "saveFlight()" );	//https://stackoverflow.com/questions/5303899/change-onclick-action-with-a-javascript-function
//Might have to change from flightcode	
	for(i in savedFlightList){ //Checks if the saved flight and current flight are the same using flight code, might have to be changed.
		if(savedFlightList[i].flightCode == searchedFlight.flightCode){
			saveDiv.style.display = "none";
			saveButton.setAttribute( "onClick", "" );	//https://stackoverflow.com/questions/5303899/change-onclick-action-with-a-javascript-function
		}
	}
	
	
	
	
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
	
	this.loadBasic = function(x){ //Creates a synopsis of the flight for the homepage
		var basicFlight = "<div data-role='collapsible' id='basicFlightInfo'><h1>"+this.name+"</h1><a href='#flightpage' onclick ='savedFlightList["+x+"].loadFlight()'><h2>Flight "+this.departingAirport+" to "+this.arrivingAirport+"</h2></a><h3>Arrives at "+this.predictedArrival+"</h3><h3 id=timer"+x+"></h3><button id='deleteFlight' onclick='deleteFlight("+x+")'><h5> Delete Flight </h5></button></div>"
		
		flightTimer("timer"+x, this.predictedArrival);
		
		return basicFlight
	}
}


//The script for the countdown timer. From https://www.w3schools.com/howto/howto_js_countdown.asp
function flightTimer(divName, countDownDate) {
	timerScript[divName] = setInterval(function() {
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
			clearInterval(timerScript[divName]);
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


	//Authentication code
//Variable set up
var check = 0;

//Registers the user to Firebase
function RegisterButton(){
	var username = document.getElementById('InputUserName').value;
	var pword = document.getElementById('InputPWord').value;
	
	check = 0
	firebase.auth().createUserWithEmailAndPassword(username, pword).catch(function(error) {
		console.log(error.code);
		console.log(error.message);
		alert(error.message)
		check = 1
	}).then( function() {
		if(check == 0){
			userId = firebase.auth().currentUser.uid;
			firebase.database().ref('profile/' + userId).set({
				account: "Free Trial"
			});
			navBarSwitch(1);
			loadProfile();
			$.mobile.navigate( "#profilepage" ); //From https://api.jquerymobile.com/jQuery.mobile.navigate/
		}
	});
}

//Login Function. Uses firebase as an authenticator
function LoginButton(){
	var username = document.getElementById('InputUserName').value;
	var pword = document.getElementById('InputPWord').value;
	
	check = 0
	firebase.auth().signInWithEmailAndPassword(username, pword).catch(function(error) {
		console.log(error.code);
		console.log(error.message);
		alert(error.message)
		check = 1
	}).then( function() {
		if(check == 0){
			loadProfile();
			navBarSwitch(1);
			$.mobile.navigate( "#profilepage" ); //From https://api.jquerymobile.com/jQuery.mobile.navigate/
			downloadFlights();
		}
	});
}

//Logout function. 
function LogoutButton(){
	firebase.auth().signOut().then(function() {
		console.log("Logged out!")
	}, function(error) {
		console.log(error.code);
		console.log(error.message);
	});
	$.mobile.navigate( "#loginpage" ); //From https://api.jquerymobile.com/jQuery.mobile.navigate/
	navBarSwitch(0);
	savedFlightList = [];
	loadSavedFlights();
}


//Loads userInfo into the profile page.
function loadProfile(){
	const UsernameDiv = document.getElementById("ProfileUsername");
	const AccountDiv = document.getElementById("ProfileAccount");

	var userName = firebase.auth().currentUser.email;
	UsernameDiv.innerHTML = "<h3>" + userName + "</h3>";
	
	userId = firebase.auth().currentUser.uid;
	firebase.database().ref('profile/' + userId).once('value').then(function(snapshot) {
		var account = (snapshot.val() && snapshot.val().account) || 'Anonymous';
		AccountDiv.innerHTML = "<h4>" + account + "</h4>";
	});
	
	
	
}


//Changes Nav bar between taking the user to the login page and the profile page.
function navBarSwitch(switchTo){
	const navBarDiv1 = document.getElementById("navbarLoginProfile1");
	const navBarDiv2 = document.getElementById("navbarLoginProfile2");
	const navBarDiv3 = document.getElementById("navbarLoginProfile3");
	const navBarDiv4 = document.getElementById("navbarLoginProfile4");
	const navBarDiv5 = document.getElementById("navbarLoginProfile5");
	const navBarDiv6 = document.getElementById("navbarLoginProfile6");
	
	if (switchTo == 1) { //Checks if user is logged in
		navBarDiv1.href = "#profilepage";
		navBarDiv2.href = "#profilepage"
		navBarDiv3.href = "#profilepage"
		navBarDiv4.href = "#profilepage"
		navBarDiv5.href = "#profilepage"
		navBarDiv6.href = "#profilepage"
	} else {
		navBarDiv1.href = "#loginpage";
		navBarDiv2.href = "#loginpage"
		navBarDiv3.href = "#loginpage"
		navBarDiv4.href = "#loginpage"
		navBarDiv5.href = "#loginpage"
		navBarDiv6.href = "#loginpage"
	}
}

function AccountButton(account){
	userId = firebase.auth().currentUser.uid;
	if(account == "Free"){
		firebase.database().ref('profile/' + userId).set({
			account: "Free Trial"
		});
	}else if(account == "Personal"){
		firebase.database().ref('profile/' + userId).set({
			account: "Personal"
		});
	}else if(account == "Enterprise"){
		firebase.database().ref('profile/' + userId).set({
			account: "Enterprise"
		});
	}
	loadProfile()
}