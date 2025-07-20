import './dependencies/d3.v7.js'
import { reqDeleteUser, insertSavedTracksIntoDB, checkForExistingUser, insertUser,insertTrackFeaturesToDB, countSavedTracks,insertArtistsToDB, insertTrackCreatedBy, getGenres, getArtists,getSavedTracks, serverRequest} from './dbHandling.js';
import * as sptfy from "./spotifyRequests.js";
import {redirectToAuthCodeFlow, getAccessToken} from './connectingToSpotify.js'
import { displayGenreLink} from './forceGraph.js';
import localUserData from "../data/myData.JSON" with {type: "json"};


document.body.style.overflow = 'hidden'; //Disables scrolling
var redirectURL = window.location.href
var clientId = 'b9226c06a3e742a98e1a8ae0c1d50bec'; 
const params = new URLSearchParams(window.location.search);
const code = params.get("code");
let accessToken = "";

//Elements
const deleteBtn = document.getElementById("deleteUser")

//EventListeners
deleteBtn.addEventListener("click",confirmDeletion)




//PRECHECKS BEFORE RUNNING SERVER IN DIFFERENT LOCATION:
// check if redirect URL is correct
// check if redirect URL is in spotify settings
// check if server login information/ip is correct 
// check if database is created

if (!code){ 
    redirectToAuthCodeFlow(clientId,redirectURL); //If user hasn't authorised, redirects to authcodeflow
    //main() // uncomment when testing
}
else{
     
    ///* FOR CONNECTING TO SPOTIFY SERVER
    console.log(redirectURL)
    accessToken = await getAccessToken(clientId, code,"http://localhost/spotifyVisualisationv2/pages/home.html");//Requests access token from spotify
    console.log(accessToken);//Access token required to access spotify api

    //https://digital.notredamecoll.ac.uk/students/intake2022/S2200859/NEA/spotifyVisualisation/pages/home.html
    //http://localhost/spotifyVisualisation/pages/home.html
    

    if(accessToken != undefined){
        console.log("Connection Successful");
        main(accessToken);
    }
    else{
        console.log("err");
    }

}

    
async function main(accessToken){

    const userData = await getUserData(accessToken); //Data retrival via API queries 

    //var userData = localUserData
    console.log("localUserData: ", localUserData);
    console.log("userData: ",userData);
    
    
    const releaseDates = await getReleaseDates(userData.savedTracks);
    var rawArtistGenres = await getGenres({id: userData.userProfile.id});//fetches from db
    

    var genreData = processGenres(rawArtistGenres)//Returns array of genres that are correlated(for graph linking) and artists and their genres  
    console.log(genreData)
    


    //------------ GRAPH SECTION ------------
    var forceData = prepareGenreLinkingData(genreData); //Prepares data to populate force graph. 
    //JSON in the form of:
    //forceData {
    //    nodes:arr of nodes,
    //    links:arr of links 
    //}
    //link -> {source:[node], target: [node], value:[line weight]}
    //node -> {id: [genre], group: [parent genre], occureces: [int]}

    displayGenreLink(forceData)

    //displayArtistsFromSaved(userData.filteredArtists,"#artists"); 
    //displayDecadesChart(releaseDates,"#decades"); 
    //displayBoxPLot(userData,"#boxPlot")

}

function confirmDeletion(){

    var userConfirmed = confirm("Are you sure?");

    if (userConfirmed) {

        deleteUser()
        alert("Profile deleted from database");
        window.location.assign("../pages/index.html");
    } 
    

}

async function deleteUser(){

    let userData = JSON.parse(localStorage.getItem("userData"))

    let response = await reqDeleteUser(userData.userProfile)
    console.log(response)
    
}


async function getUserData(accessToken){

    const ENABLE_DB_HANDLING = false
    
    console.log("fetching user profile")
    var userProfile = await sptfy.fetchProfile(accessToken);

    var existingUser = await checkForExistingUser({ //Checks if user is already in DB
        id: userProfile.id,
    })
    


    if (!existingUser){ //If user is not in db,

        let response = await insertUser({ //They get inserted,
            id: userProfile.id,
            username: userProfile.display_name
        })

        console.log(response)
        var trackCount = 0
    }
    else{

        let response = await countSavedTracks({ //RETURNS NUMBER OF SAVED TRACKS SAVED IN DB

            id: userProfile.id

        })
        
        console.log(response)
        var trackCount = response.trackCount
        
    } //TODO: get saved tracks from db and add to userdata then get new tracks added to saved tracks.





    console.log("fetching top items")
    var topItems = 
    {
        topArtists: await sptfy.fetchTopArtists(accessToken),
        topTracks: await sptfy.fetchTopTracks(accessToken)
    };

    console.log("fetching saved tracks")
    var savedTracks = await sptfy.fetchSavedTracks(accessToken,20,trackCount)//add trackCount param here
    var trackIds = compileTrackIds(savedTracks)
    // var trackFeatures = await fetchTrackFeatures(trackIds,50) // DEPRECATED API 
    

    
    console.log("processing new artists")
    var [discoveredArtists,artistIds] = await getDiscoveredArtists(accessToken,savedTracks);
    var filteredArtists = filterDictionary(discoveredArtists,3)
    var artistDetails = await getArtistDetails(accessToken,artistIds)
    

    
    console.log("fetching data from db")
    var rawArtistData = await getArtists(userProfile);//fetches from db
    var artistDataDB = await processArtists(rawArtistData)

    console.log("compiling user data")
    var userData =  
    {   
        userProfile: userProfile,
        topItems: topItems,
        savedTracks: savedTracks,
        trackIds: trackIds,
        artistDetails: artistDataDB,
        //trackFeatures: trackFeatures, // DEPERECATED API
        //artistIds: artistIds
        //topGenres: topGenres
        //artistDetails: artistDetails, //legacy artistdetails
        //discoveredArtists: discoveredArtists, //legacy artist occurences
    }
    
    //DATABASE HANDLING 
    //Inserts any new data gathered
    localStorage.setItem("userData",JSON.stringify(userData))

    if(ENABLE_DB_HANDLING){
        console.log("inserting new records into db")
        await insertSavedTracks(savedTracks);//their saved tracks are added onto the DB
        await insertTrackFeatures(trackFeatures);//Saves track features into DB
        await insertArtists(artistDetails);
        await connectArtistsToTracks(savedTracks);
    }

    console.log("DONE")
    console.log(userData)
    return userData;
}

async function processArtists(rawArtistData){ //Takes in data records and creates an artist profile and counts occurences

    var artistData = new Array();
    var occurences = new Object();
    var filteredOccurences = new Object();

    for (let i = 0; i< rawArtistData.length;i++){

        let selectedArtist = rawArtistData[i]
        if(!(selectedArtist.artistName in occurences)){
            
            artistData.push(selectedArtist)
        }
        countOccurences(selectedArtist.artistName,occurences)
        //if (!occurences.includes(selectedArtist.artistName)) {artistData.push(selectedArtist)}
        //countOccurences(selectedArtist.artistName,occurences)
    }
    return {
        artistData: artistData,
        occurences: occurences
    }
}


function processGenres(rawArtistGenres){
    
    var discoveredArtists = new Array();
    var genreArrs = new Array();
    var currGenreArray = new Array();
    var genreDict = new Object;
    var genreList = new Array();
    var genreArtist = {};

    for(var i = 0; i < rawArtistGenres.length-1; i++){//Goes down records. -1 as 2 tracks are processed at a time
        
        var currTrack = rawArtistGenres[i].trackName
        var nextTrack = rawArtistGenres[i+1].trackName

        var genre = rawArtistGenres[i].genreID
        var artist = rawArtistGenres[i].artistName

        if(!discoveredArtists.includes(artist)){ //Does not process genre if artist already processed 

            currGenreArray.push(genre)
            countOccurences(genre,genreDict)
            if(!genreList.includes(genre)){genreList.push(genre)}
            if(currTrack != nextTrack){ //Checks if next track is different and if it is starts preparing for next set of genres 
                
                
                if(currGenreArray.length > 1 ){
                    genreArrs.push(currGenreArray) //only pushes if genreArr has at least 2.
                }
                
                genreArtist[artist] = currGenreArray
                
                discoveredArtists.push(artist) //Pushes artist to array of processed artists
                var currGenreArray = [] //resets current array for next genres to be stored 
            }
        }
    }

    return {
        genreArrs: genreArrs,
        genreOccurences: genreDict,
        genreArtist: genreArtist,
        genreList: genreList
    }
}

async function connectArtistsToTracks(tracks){
    var trackCreatedBy = new Array();

    tracks.forEach(track => {
        var artistArr = track.track.artists;
        var trackID = track.track.id;
        var datePublished = track.track.album.release_date;
        var datePrecision = track.track.album.release_date_precision;

        artistArr.forEach(artist => {

            var artistID = artist.id;
            var jsonTrackCreatedBy = {
                trackID: trackID,
                artistID: artistID,
                datePublished: datePublished,
                datePrecision: datePrecision
            }

            trackCreatedBy.push(jsonTrackCreatedBy)
        });
    });

    var dataToSend = {connections: trackCreatedBy}
    var response = await insertTrackCreatedBy(dataToSend);
    console.log(response)


}

async function insertArtists(artists){
    var artistArr = new Array();
    var genreArr = new Array();

    artists.forEach(artist => {
        var genres = artist.genres

        var jsonArtist = {

            artistID: artist.id,
            name: artist.name,
            followers: artist.followers.total,
            popularity: artist.popularity
        }        

        genres.forEach(genre => {

            var jsonGenre = {
                artistID: artist.id,
                genreID: genre
            }
            genreArr.push(jsonGenre)

        });

        artistArr.push(jsonArtist)
    });

    var dataToSend = {artists: artistArr , genres: genreArr}


    var response = await insertArtistsToDB(dataToSend);
    console.log(response)
    

}

// DEPRECATED
async function fetchTrackFeatures(savedTracks,chunkSize){
    
    var trackFeatures = new Array();
    for (var i = 0; i < savedTracks.length; i+= chunkSize){


        //Requests chunks of 50 track features 
        var chunk = savedTracks.slice(i,i+chunkSize) //Setting the chunck
        var trackString = JSON.stringify(chunk)
        var formattedData = trackString.replace(/^\[|\]$/g, '')//
        var dataToSend = formattedData.replace(/"/g, '');//Removes all "

        var response = await sptfy.fetchTrackFeatues(dataToSend);
        var audioFeats = response.audio_features

        trackFeatures.push(...audioFeats)

    } 

    return trackFeatures
    
}

function compileTrackIds(savedTracks){

    var trackIds = new Array();

    savedTracks.forEach(track => {
        var trackId = track.track.id
        trackIds.push(trackId)
    });

    return trackIds

}

async function insertTrackFeatures(trackFeatures){ 
    var dataArr = new Array();

    trackFeatures.forEach(track => {

        try{

            var jsonFeatures = {

                trackID: track.id, 
                acousticness: track.acousticness, 
                danceability: track.danceability, 
                energy: track.energy, 
                instrumentalness: track.instrumentalness, 
                trackKey: track.key,  
                liveness: track.liveness, 
                loudness: track.loudness, 
                mode: track.mode, 
                speechiness: track.speechiness, 
                tempo: track.tempo, 
                time_signature: track.time_signature, 
                valence: track.valence
            }
            dataArr.push(jsonFeatures)
        }
        catch{
            console.log("err")
        }
        
    });

    var response = await insertTrackFeaturesToDB(dataArr);

    console.log(response)

}


async function insertSavedTracks(savedTracks){ 

    //When adding a new track to the db,

    var trackArr = new Array();
    var userArr = new Array();

    var userData = JSON.parse(localStorage.getItem("userData"))
    var userID = userData.userProfile.id

    savedTracks.forEach(track => {
        var currTrack = track.track
        var dateAdded = (track.added_at).slice(0,10)//gets date added in form of YYYY-MM-DD
        var minsHr = msToMinHr(currTrack.duration_ms)

        var jsonTrack = {
            trackID: currTrack.id,
            trackName: currTrack.name,
            artist: currTrack.artists[0].name,
            duration: minsHr,
            albumCover:currTrack.album.images[1].url
        };

        var jsonUser = {
            userID: userID,
            trackID: currTrack.id,
            dateAdded: dateAdded
        }

        var jsonArtist
        trackArr.push(jsonTrack)
        userArr.push(jsonUser)
    });

    

    var dataToSend = {
        tracks:trackArr,
        userData:userArr
    }


    var response = await insertSavedTracksIntoDB(dataToSend);

    console.log(response)

}

function msToMinHr(ms){

    var min = Math.floor((ms/1000/60) << 0 );
    var sec = Math.floor((ms /1000 ) % 60 );
    if(sec.toString().length == 1){
        sec = sec + "0"
    }
    var minSec = (min + ":" + sec)
    return minSec

}






async function getReleaseDates(savedTracks){
    const releaseDates = new Object()

    for(let i = 0; i < savedTracks.length; i++){

        var releaseYear = savedTracks[i].track.album.release_date.slice(0,4)
        var releaseDecade = releaseYear.slice(0,3) + "0s"
        countOccurences(releaseDecade,releaseDates)

    }
    return releaseDates
}








async function getDiscoveredArtists(accessToken,savedTracks){
    var artistDict = new Object;
    var artistIds = new Array;

    for (let i = 0; i< savedTracks.length;i++){

        let selectedArtists = savedTracks[i].track.artists

        for (let j = 0; j < selectedArtists.length ; j++){
            var artist = selectedArtists[j].name
            countOccurences(artist,artistDict)

            if (!(artistIds.includes(selectedArtists[j]))){
                artistIds.push(selectedArtists[j])

                

            }

        }
    }



    return [artistDict,artistIds]

}

async function countOccurences(item,dictionary){

    if(!(item in dictionary)){
        dictionary[item] = 1; //Creates new object(genre) if doesn't exist
        //console.log("new item added: ",item)

    }
    else{
        dictionary[item]++; //Increments 1 in an existing object(genre)
        //console.log("item icremented: ",item," now at: ", dictionary[item])
    }

}

function filterDictionary(dictionary,minimumOccurences){
    
    let itemArray = Object.keys(dictionary) //Puts all items into an array
    const filteredDictionary = new Object;

    for(let i = 0; i < itemArray.length ; i++ ){ //Goes through each item

        let currItem = itemArray[i];

        if (dictionary[currItem] >= minimumOccurences){  //Checks if item occurence is more than minimum
            filteredDictionary[currItem] = dictionary[currItem] //If so add to new object 
        }
    }
    return filteredDictionary;
}

async function getDiscoveredGenres(accessToken,artistIds){
    
    const genreCount = new Object

}


async function getArtistDetails(accessToken,userData){

    var artistIds = await compileIDs(userData)
    var currIds;
    var artistDetails = [];

    for (var pass = 0; pass <=  artistIds.length/50; pass++){ //Batches of 50 as spotifyAPI can max return 50 artists.
        
        currIds =  artistIds.slice(pass*50,pass*50+50).toString()  
        artistDetails = artistDetails.concat((await sptfy.fetchArtistDetails(accessToken,currIds)).artists);
    }
    
    return artistDetails
}

async function compileIDs(artistIds){
    var idList = new Array();
    for (var i = 0; i < artistIds.length; i++){
        if(!idList.includes(artistIds[i].id)) {
            idList.push(artistIds[i].id)

        } 
    }
    return idList
}



function prepareGenreLinkingData(genreData){

    //var artistDetails = userData.artistDetails;
    var data = prepareData(genreData)

    console.log(data)
    return  data

}

function prepareData(genreData){
    
    //var [genreArrs,genreOccurences] = prepareGenres(artistDetails)//genreArrs store the genres stored in each artist JSON as an array
    var nodes = prepareNodes(genreData.genreList,genreData.genreOccurences)
    var links = prepareLinks(genreData.genreArrs)

    return {
        nodes:nodes,
        links:links
    }

}

function prepareNodes(genreList,genreOccurences){
    var nodes = new Array();

    
    for(var i = 0; i < genreList.length; i++){

        var group = checkForMajorGenre(genreList[i])
        nodes.push({"id":genreList[i],"group":group,"occurences":genreOccurences[genreList[i]]})
    }
    
    return nodes
    //node e.g:  {id: genrename, group: someNum}
}

function checkForMajorGenre(genre){
    var majorGenres = ["pop","rap","rock","classical","disco","country","EDM"]
    var group;

    switch(genre){
        case genre.match(/(pop)/)?.input:
            group = 1
            break;
        case genre.match(/(rap)/)?.input:
            group = 2
            break;
        case genre.match(/(rock)/)?.input:
            group = 3
            break;
        case genre.match(/(classical)/)?.input:
            group = 4
            break;
        case genre.match(/(disco)/)?.input:
            group = 5
            break;
        case genre.match(/(country)/)?.input:
            group = 6
            break;
        case genre.match(/(EDM)/)?.input:
            group = 7
            break;
        case genre.match(/(indie)/)?.input:
            group = 8
            break;
        case genre.match(/(hip hop)/)?.input:
            group = 9
            break;
        case genre.match(/(jazz)/)?.input:
            group = -1
            break;
        case genre.match(/(soul)/)?.input:
            group = -1
            break;
        default:
            group = -1

    }
    return group
}





function removeDuplicates(artistDetails){
    var genreList = new Array();
    for(var i = 0; i < artistDetails.length; i++){
        var genres = artistDetails[i].genres

        for(var j = 0; j < genres.length;j++){
            if(!genreList.includes(genres[j])){genreList.push(genres[j])}

        }

    }

    return genreList;
}





function prepareLinks(genreArrs){

    var genreLinks = new Array();
    
    //TestData
    var genre = ["Rock","Blues","Alt","Indie","Pop"]
    var nums = ["0","1","2","3"]


    for(var i = 0; i<genreArrs.length;i++){
        var currGenreArray = genreArrs[i]

        connectNodes(genreLinks,currGenreArray)
    }
    
    return genreLinks;

}

function connectNodes(genreLinks,currGenreArray){ //Recursive function that creates links for nodes in an array

    var srcNode = currGenreArray.pop(); //Pop used as for every time function is called, srcNode has all of its required links.
    var srcPointer = currGenreArray.length-1;

    if (currGenreArray.length >= 2)
    {
        for(var i = srcPointer; i >= 0; i--){ //Goes down array creating a new link obj until reaches end 

            var trgNode = currGenreArray[i]
            genreLinks.push({"source":srcNode, "target": trgNode,"value":1}) 
            
        }
    }
    

    if (currGenreArray.length != 1){ //when one last node is remaining, all links has already been made.
        connectNodes(genreLinks,currGenreArray)
    }

}

function exisitingLink(genreArray){ //increment link every time same link appears


    return false
}

function prepareGenres(artistDetails){
    var genreArrs = new Array
    var genreDict = new Object;

    for(var i = 0; i < artistDetails.length; i++){
        var currGenreArray = artistDetails[i].genres;
        if (currGenreArray.length > 1 ) {genreArrs.push(currGenreArray)}//Needs an array with at least 1 link (2 nodes, 2 genres) to prevent stack overflow
        
        currGenreArray.forEach(genre => { //Counts genre occyu

            countOccurences(genre,genreDict)
            
        }); 
    }
    
    //console.log("genreArrs:", genreArrs)
    console.log("genreDict:", genreDict)
    return [genreArrs,genreDict]
}


