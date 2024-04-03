import * as sptfy from "./spotifyRequests.js";

const accessToken = localStorage.getItem("accessToken")
var playlistCart = JSON.parse(localStorage.getItem("playlistCart"));
const userData = JSON.parse(localStorage.getItem("userData"));
const userId = userData.userProfile.id

console.log(playlistCart)

document.addEventListener("DOMContentLoaded",loadTracks(playlistCart),refreshEventListeners())

function refreshEventListeners(){
    var removeBtns = document.querySelectorAll(".removeBtn");
    removeBtns.forEach(function(button) {
        button.addEventListener("click", removeTrack);
    });

}

document.getElementById("playlistForm").addEventListener("submit",submitPlaylist);

function submitPlaylist(event){

    event.preventDefault(); // Prevent default form submission

    // Get form data
    var formData = new FormData(this);
    var playlistData = {}; //Create object 

    formData.forEach(function(value, key){
        if (key === "public") {
            // Convert visibility to boolean
            playlistData[key] = (value === "isPublic");
        } else {
            playlistData[key] = value;
        }
    });

    if (!playlistData.hasOwnProperty('public')) { //If visibility has not been specified assume it is private.
        playlistData['public'] = false;
    }
    createPlaylist(playlistData);

}


async function createPlaylist(playlistData){
    var response = await sptfy.createPlaylist(userId,playlistData)
    console.log(response)
    await addTrackstoPlaylist(response.id)
}

async function addTrackstoPlaylist(playlistId){

    var trackUris = getTrackUris(playlistCart);
    var response = await sptfy.addTracksToPlaylist(userId,playlistId,trackUris)
    console.log(response)

}

function getTrackUris(playlistCart){

    var trackUris = new Array();

    playlistCart.forEach(currItem => {

        trackUris.push(currItem.uri)
        
    });

    return trackUris;

}



function loadTracks(playlistCart){

    const playlistContainer = document.getElementById("playlistContainer");
    var playlistHTML = "";
    var i = 0
    var totalDuration = 0;
    if (playlistCart != null){
        
        

        playlistCart.forEach(track => {
            var audioHTML = "";
            
            if (track.preview_url != null){
                audioHTML = 
                `
                <audio controls >
                    <source src="${track.preview_url}" type="audio/mpeg">
                </audio>
                `
            }
            else{
                audioHTML = `preview not avaliable `
            }
    
    
            playlistHTML +=
            `
            <div class="track">
                <div class = "container" style = "padding: 10px">
                    <div class= "row">
                    
                        <div class = "col-md-2">
                            <img src="${track.album.images[2].url}" alt="${track.name}">
                        </div>
    
                        <div class = "col-md-3">
    
                            <div class= "row">
                                <div class="col-md-12">
                                    <div class="trackName">${track.name}</div>
                                </div>
                            </div>
    
                            <div class= "row">
                                <div class="col-md-12">
                                    <div class="artistName">${track.artists[0].name}</div>
                                </div>
                            </div>
                            <div class= "row">
                                <div class="col-md-12">
                                    <div class="duration">${msToMinHr(track.duration_ms)}</div>
                                </div>
                            </div>
                            
                        </div>
    
                        <div class = "col-md-6 px-2">
    
                            <div class="mediaControls">
                                ${audioHTML}
                            </div>
                        </div>
                        
                        <div class= "col-md-.5 px-2">
                            <button type="button" class="removeBtn" value="${i}">×</buttons>
                        </div>
                        
                    </div>
                </div>
            
            </div>`;
            i++;

            totalDuration += track.duration_ms

        });
    }
    else{
        playlistHTML = 

        `
        <div class="track">
            playlist cart is empty
        </div>`

    }

    playlistHTML += 
    `
        <div class="totalDuration">
            Total Duration: ${msToMinHr(totalDuration)}
        </div>
    `
    

    playlistContainer.innerHTML = playlistHTML;
}

function removeTrack(event){
    var index = event.target.value
    playlistCart.splice(index,1)
    localStorage.setItem("playlistCart",playlistCart)
    loadTracks(playlistCart);
    refreshEventListeners();
}

function msToMinHr(ms){

    var min = Math.floor((ms/1000/60) << 0 );
    var sec = Math.floor((ms /1000 ) % 60 );
    if(sec.toString().length == 1){
        sec = "0"+ sec
    }
    var minSec = (min + ":" + sec)
    return minSec

}