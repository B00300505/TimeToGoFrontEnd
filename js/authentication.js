//Most of code from https://azure.microsoft.com/en-gb/resources/samples/active-directory-javascript-singlepageapp-dotnet-webapi/

// Enter Global Config Values & Instantiate ADAL AuthenticationContext
window.config = {
        instance: 'https://login.microsoftonline.com/',
        tenant: 'DSPTimeToGo.onmicrosoft.com',
        clientId: 'c7b75b88-b485-4061-baca-dfa6fabedcb6',
        postLogoutRedirectUri: window.location.origin,
        cacheLocation: 'localStorage' // enable this for IE, as sessionStorage does not work for localhost.
};
var authContext = new AuthenticationContext(config);


//Load whenever website loads
window.onload = function(){
	var user = authContext.getCachedUser();
	if (user) { //Checks if user is logged in
		loadProfile()
	} else {
		console.log("Currently logged out");
	}
}


// Check For & Handle Redirect From AAD After Login
var isCallback = authContext.isCallback(window.location.hash);
authContext.handleWindowCallback();
console.log(authContext.getLoginError());

if (isCallback && !authContext.getLoginError()) {
    window.location = authContext._getItem(authContext.CONSTANTS.STORAGE.LOGIN_REQUEST);
	$.mobile.navigate( "#profilepage" );
}

//Gets called by login/logout buttons before calling the real login register functions
function LoginButton(){
	LoginFunction();
}

function LogoutButton(){
	LogoutFunction();
}

//The actual login/register function. Created this way incase login is needed when not using the buttons.
function LoginFunction(){
	authContext.login();
}

function LogoutFunction(){
	authContext.logOut();
}

//Loads userInfo into the profile page.
function loadProfile(){
	const UsernameDiv = document.getElementById("ProfileUsername");
	var user = authContext.getCachedUser();
	console.log(user)
	UsernameDiv.innerHTML = "<h3>" + user.userName + "</h3>";
}
