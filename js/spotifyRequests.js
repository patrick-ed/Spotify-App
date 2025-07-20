export async function fetchArtistDetails(accessToken,ids){
    const params = new URLSearchParams();
    params.append("ids",ids);

    const result = await fetch(`https://api.spotify.com/v1/artists?${params.toString()}`, {

        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }

    });
    return await result.json()

}

export async function getEmbed(url){


    const result = await fetch(`https://open.spotify.com/oembed?url=${url}`,{
        method: "GET", 
    });

    return result.json();

}


export async function fetchPlaylistTracks(accessToken,playlistId){
    const params = new URLSearchParams();
    params.append("limit",50);


    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks/${params.toString()}`,{
        method: "GET", 
        headers: { Authorization: `Bearer ${accessToken}` }
    });

}

export async function fetchProfile(accessToken) { 
    const result = await fetch("https://api.spotify.com/v1/me", {
        method: "GET", 
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await result.json();
}

export async function fetchSavedTracks(accessToken,maxPasses,tracksInDb){

    var savedTracks = [];
    var pass = 0
    var done = false;

    do{
        var serverResponse = await reqSavedTracks(accessToken,(pass*50))
        savedTracks = savedTracks.concat(serverResponse.items);

        console.log("   pass:",pass,"   tracks:",savedTracks.length,"/",serverResponse.total,"(max:",(maxPasses+2)*50,")") // pass: int tracks: int / int

        if(pass > maxPasses || (pass*50 > (serverResponse.total)) || !(tracksInDb < serverResponse.total)){
            done = true;
        }

        
        pass++
    }while(!done);
    return savedTracks;
}

export async function reqSavedTracks(accessToken,offset){
    const params = new URLSearchParams();
    params.append("limit", 50)
    params.append("offset",offset)
    const result = await fetch(`https://api.spotify.com/v1/me/tracks?${params.toString()}`, {

        method: "GET",
        headers: { Authorization: `Bearer ${accessToken}` }

    });
    return result.json();

}
export async function fetchTopArtists(accessToken) { //Returns top tracks

    const params = new URLSearchParams(); //Selects search params to specify request
    params.append("limit", 50); //Request 50 items
    params.append("time_range","long_term") //User data from all-time

    const result = await fetch(`https://api.spotify.com/v1/me/top/artists?${params.toString()}`, {
        method: "GET", // GET - request data from API
        headers: { Authorization: `Bearer ${accessToken}` } //accessToken needed to access data

    });

    return await result.json(); //Returned as JSON
}

export async function fetchTopTracks(accessToken) {
    const result = await fetch("https://api.spotify.com/v1/me/top/tracks?limit=50", {
        method: "GET", 
        headers: { Authorization: `Bearer ${accessToken}` }
    });

    return await result.json();
}


export async function fetchRecs(seed_genres) {

    console.log(seed_genres)
    const params = new URLSearchParams(); //Selects search params to specify request
    params.append("limit", 3);
    params.append("seed_genres", seed_genres); //Request 50 items



    const result = await fetch(`https://api.spotify.com/v1/recommendations?${params.toString()}`, {
        method: "GET", 
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });

    return await result.json();
}

export async function search(seed_genre,offset){ //https://developer.spotify.com/documentation/web-api/reference/search


    const result = await fetch(`https://api.spotify.com/v1/search?q=genre=${seed_genre}&type=track&limit=10&offset=${offset}`, {
        method: "GET", 
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });

    return await result.json();

}

// DEPRECATED API
export async function fetchTrackFeatues(trackIds){


    const params = new URLSearchParams();

    const result = await fetch(`https://api.spotify.com/v1/audio-features?ids=${trackIds}`, {
        method: "GET", 
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` }
    });
    
    return await result.json();

}

export async function createPlaylist(userId,body){


    const params = new URLSearchParams();

    const result = await fetch(`https://api.spotify.com/v1/users/${userId}/playlists`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: JSON.stringify(body)  
    });

    return await result.json();

}

export async function addTracksToPlaylist(userId,playlistId,body){


    const params = new URLSearchParams();

    const result = await fetch(`https://api.spotify.com/v1/playlists/${playlistId}/tracks`, {
        method: "POST", 
        headers: { Authorization: `Bearer ${localStorage.getItem("accessToken")}` },
        body: JSON.stringify(body)  
    });

    return await result.json();

}





//https://api.spotify.com/v1/search?q=${params.toString()}

//https://api.spotify.com/v1/search?q=genre=${seed_genre}&type=track&limit=10&offset=0