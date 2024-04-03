import * as graph from "./graphs.js";
import './dependencies/d3.v7.js';

const userData = JSON.parse(localStorage.getItem("userData"))
console.log(userData)

const profile = userData.userProfile
const topItems = userData.topItems

populateProfile(profile)
populateLists(topItems)

const artistOccurences = userData.artistDetails.occurences

var filteredOccurences = new Object();
for(var key in artistOccurences){

    var occurences = artistOccurences[key];

    if (occurences >= 3){
        filteredOccurences[key] = occurences
    }
}
console.log(userData.artistDetails.occurences)


document.addEventListener("DOMContentLoaded", graph.artistChart(filteredOccurences,"#artistChart"));






function populateProfile(profile){

    document.getElementById("displayName").innerText = profile.display_name;
    if (profile.images[0]) {

        const profileImage = new Image(200, 200);
        const link = profile.images[0].url

        profileImage.id = "profileImage";
        profileImage.src = profile.images[0].url;
        
        document.getElementById("avatar").appendChild(profileImage);

        profileImage.onclick = function() {
            window.location.href = link;
        };        
    }

}

function populateLists(topItems){

    var topTracks = topItems.topTracks
    var topArtists = topItems.topArtists

    var topTracksDiv = document.getElementById("topTracks")
    var topArtistsDiv = document.getElementById("topArtists")

    var trackUl = document.createElement('ul');
    var artistUl = document.createElement('ul');

    for (var i = 0; i < 5; ++i) {

        var trackName = topTracks.items[i].name
        var albumCover = topTracks.items[i].album.images[2].url

        var artistName = topArtists.items[i].name
        var artistImg = topArtists.items[i].images[2].url

        insertIntoList(trackUl,trackName,albumCover)
        insertIntoList(artistUl,artistName,artistImg)

    }
    topTracksDiv.appendChild(trackUl);
    topArtistsDiv.appendChild(artistUl);



}

function insertIntoList(ul,value,imageUrl){

    var li = document.createElement('li');
    li.innerHTML = value;
    ul.appendChild(li);
    li.style.listStyleImage = `url(${imageUrl})`;

}

//value     --  topTracks.items[i].name
//imgUrl    --  topTracks.items[i].album.images[2].url
