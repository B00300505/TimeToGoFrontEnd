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
	navBarSwitch(0)
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








