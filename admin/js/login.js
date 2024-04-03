// Add event listeners to the form
const form = document.getElementById('login');
form.addEventListener('submit', handleFormSubmit);

function handleFormSubmit(event) {
	event.preventDefault();

	//gather the data from the form fields into JSON 
	var adminDetails = {
		
		username: document.getElementById("username").value,
		password: document.getElementById("password").value
		
	}
	console.log(adminDetails);
	postRequest(adminDetails);

}


async function postRequest(adminDetails){
	// make an AJAX POST request to server 

	try{

		const response = await fetch("../php/login.php",{
			method: 'POST',
			headers: {
				
				'Content-Type': 'application/json', // sent request
				'Accept': 		'application/json'  // expected data sent back
				
			},
			body: JSON.stringify(adminDetails),
		})

		const admindata = await response.json();
		console.log(admindata);
		handleResponseCode(admindata);

	}catch (error){
    	console.log('Error:',error);
	}
	
}

function handleResponseCode(admindata){
	console.log("response code: ", admindata.code);
	console.log("response jwt: ", admindata.jwt);
	console.log("response adminID: ", admindata.adminID);

	if (admindata.code  == 0){
		// error
		alert ("Invalid credentials! Please try again");
	}
	
	else if (admindata.code == 1){
		// account exist, create a session storage to store key-value pairs in the browser
		//session storage is faster and more secure than cookies for storing small amounts of data
		//data stored in session storage is only  accessible within the tab where it was stored
		//when the user closes the tab or the browser, the session storage is deleted
		
		// Store a value in session storage
		sessionStorage.setItem("webToken", admindata.jwt);
		sessionStorage.setItem("loggedIn", "true");

		// store adminID in local storage using localStorage API
		localStorage.setItem('adminID', admindata.adminID);
		
		// redirect to the dashboard
		var redirect = "../pages/adminDashboard.html";
		window.location.assign(redirect);
	}

}

