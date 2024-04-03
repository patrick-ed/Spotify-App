import { getSavedTracks} from './dbHandling.js';

const userData = JSON.parse(localStorage.getItem("userData"))
console.log(userData)

var savedTracks = await getSavedTracks({id: userData.userProfile.id});
//access album covers at "savedTracks[i].albumCover"
console.log(savedTracks);

var trackWallContainer = document.getElementById("trackWall")
var totalRows = Math.floor(savedTracks.length/5);
var colCount = 5;
var remaining = savedTracks.length % 5;
var rowHtml = "";
var colHtml="";

var track = 0;
for(var row = 0; row < totalRows; row++){

    var colHtml="";
    for(var col = 0; col < colCount;col++){

        //const imageURL = await fetchImage(savedTracks[track].albumCover); //load then display
        const imageURL = savedTracks[track].albumCover; //display and load
        colHtml+= `
        
        <div class="col">
            <div class="trackContainer">
                <a href ="https://open.spotify.com/track/${savedTracks[track].trackID}" target="_blank">
                    <img src="${imageURL}" alt="img loading" class="image">
                    <div class="overlay">
                        <div class="text">${savedTracks[track].trackName}</div>
                    </div>
                </a>
                </div>
        </div>
        
        `
        track++;
    }
    rowHtml +=`<div class="row no-gutters">${colHtml}</div>`;
}

async function fetchImage(url) {
    const response = await fetch(url);
    const blob = await response.blob();
    return URL.createObjectURL(blob);
}

trackWallContainer.innerHTML=rowHtml;

