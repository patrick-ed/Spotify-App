
document.addEventListener('DOMContentLoaded', function () {

  //gather the session data
	const dataTosend = {
		// retrieve the CustID from local storage using the localStorage API
		adminID: localStorage.getItem('adminID'),
		webToken: sessionStorage.webToken
	}
	console.log(dataTosend);
	  
	if (dataTosend.webToken === undefined) {
	
		// webToken is undefined, so user not logged in
	   
		alert("You need to log in");
		window.location.assign("../pages/login.html");
	
	} else {

  const condition = "allTracks"
  fetchAllTracks(condition, dataTosend);
  }
}
)



function changeCardTitle(cardTitleElement, newTitle) {
  cardTitleElement.style.fontSize = '24px'
  cardTitleElement.innerText = newTitle;
}

// fetch customer details

async function fetchAllTracks(condition, dataTosend){
  

  try{

    const response = await fetch("../php/viewTracks.php",{
      method: "POST",
      body: JSON.stringify({condition: condition, dataSent: dataTosend})
    })
  
    const tableBody = document.querySelector("#customerlist tbody");
    tableBody.innerHTML = "";

    const trackDetails = await response.json();



    if (trackDetails.code  == 0){
      console.log("No customers found");
    }
    else if (trackDetails.code == 1){
      console.log("trackDetails.data",trackDetails.data);

      displayCustomerList(trackDetails,tableBody);
    
    }
  } catch (error){
    console.log('Error:',error);
  }
 
};


function displayCustomerList(trackDetails,tableBody){
  
  // create table heading
  const row = tableBody.insertRow();
  const trackIDCell = row.insertCell();
  const trackNameCell = row.insertCell();
  const artistCell = row.insertCell();
  const durationCell = row.insertCell();

 
  row.style.fontWeight = 'bold';
  trackIDCell.textContent = 'trackID';
  trackNameCell.textContent = 'trackName';
  artistCell.textContent = 'artist';
  durationCell.textContent = 'duration';


  // Loop through the JSON data

  trackDetails.data.forEach(function(trackDetails) {
  const row = tableBody.insertRow();
  const trackIDCell = row.insertCell();
  const trackNameCell = row.insertCell();
  const artistCell = row.insertCell();
  const durationCell = row.insertCell();



  trackIDCell.textContent = trackDetails.trackID;
  trackNameCell.textContent = trackDetails.trackName;
  artistCell.textContent = trackDetails.artist;
  durationCell.textContent = trackDetails.duration;

 
 });

}




