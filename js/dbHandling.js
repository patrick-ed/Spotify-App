export async function insertSavedTracksIntoDB(dataToSend){

  const serverfilename = "../php/insertTracks.php"
  var jsonData = JSON.stringify(dataToSend);


  try{

    const response = await fetch(serverfilename,
    {
      method: "POST",
      body: jsonData
    })

    const responses = await response.json();
    return responses



  }
  catch (error)
  {
    console.log('Error:',error);
  }
}




export async function insertTrackFeaturesToDB(dataToSend){

  const serverfilename = "../php/insertTrackFeatures.php"
  var jsonData = JSON.stringify({ "tracksFeatures": dataToSend });


  try{

    const response = await fetch(serverfilename,
    {
      method: "POST",
      body: jsonData
    })

    const responses = await response.json();
    return responses



  }
  catch (error)
  {
    console.log('Error:',error);
  }


  //EXAMPLE OF SQL QUERY TO GET FEATURES BY NAME:

  /*
  SELECT * FROM trackfeature,track 
  WHERE track.trackID = trackfeature.trackID
  AND track.trackName = 'dried flower' 
  */


}




export async function checkForExistingUser(dataToSend){
  
  console.log("---checking if user exists---")

  const serverfilename = "../php/checkForExistingUser.php"


  try{
    const response = await fetch(serverfilename,{
      method: "POST",
      body: JSON.stringify(dataToSend)
    })
  
    const responses = await response.json();

    return responses.inDatabase

  } catch (error){
    console.log('Error:',error);
  }
};


export async function countSavedTracks(dataToSend){


  try{
    const response = await fetch("../php/countSavedTracks.php",{
      method: "POST",
      body: JSON.stringify(dataToSend)
    })
  
    const responses = await response.json();

    return responses
  } catch (error){
    console.log('Error:',error);
  }


}



export async function insertUser(dataToSend){

  const serverfilename = "../php/insertUser.php"
  
  try{
    const response = await fetch(serverfilename,{
    method: "POST",
    body: JSON.stringify(dataToSend)
    })
    const responses = await response.json();
    return responses


  }
  catch (error){
    console.log('Error:',error);
  }
}



export async function insertArtistsToDB(dataToSend){

  const serverfilename = "../php/insertArtists.php"
  
  try{
    const response = await fetch(serverfilename,{
    method: "POST",
    body: JSON.stringify(dataToSend)
    })
    const responses = await response.json();
    return responses;


  }
  catch (error){
    console.log('Error:',error);
  }
}

export async function insertTrackCreatedBy(dataToSend){
    
  const serverfilename = "../php/insertTrackCreatedBy.php"
  
  try{
    const response = await fetch(serverfilename,{
    method: "POST",
    body: JSON.stringify(dataToSend)
    })
    const responses = await response.json();
    return responses;


  }
  catch (error){
    console.log('Error:',error);
  }
}

export async function getGenres(dataToSend){
  
  console.log("---checking if user exists---")
  try{
    const response = await fetch("../php/getGenresFromSaved.php",{
      method: "POST",
      body: JSON.stringify(dataToSend)
    })
  
    const responses = await response.json();

    return responses.data

  } catch (error){
    console.log('Error:',error);
  }

};

export async function getArtists(dataToSend){
  
  try{
    const response = await fetch("../php/getArtistsFromSaved.php",{
      method: "POST",
      body: JSON.stringify(dataToSend)
    })
  
    const responses = await response.json();

    return responses.data

  } catch (error){
    console.log('Error:',error);
  }

};

export async function getSavedTracks(dataToSend){
  
  try{
    const response = await fetch("../php/getSavedTracks.php",{
      method: "POST",
      body: JSON.stringify(dataToSend)
    })
  
    const responses = await response.json();

    return responses.data

  } catch (error){
    console.log('Error:',error);
  }

};



export async function reqDeleteUser(dataToSend){

  const serverfilename = "../php/deleteUserData.php"
  
  try{
    const response = await fetch(serverfilename,{
    method: "POST",
    body: JSON.stringify(dataToSend)
    })
    
    const responses = await response.json();
    return responses


  }
  catch (error){
    console.log('Error:',error);
  }
}


//Filter tracks by artist
/*

SELECT trackName FROM track, trackcreatedby, artist
WHERE trackcreatedby.trackID = track.trackID
AND trackcreatedby.artistID = artist.artistID
AND artistName = "Arctic Monkeys"

*/

//Display user saved tracks
/*

SELECT trackName, dateAdded FROM usersavedtracks, track, users
WHERE usersavedtracks.trackID = track.trackID
AND usersavedtracks.userID = users.userID
AND users.userID = "z9qiannyavyy09dnv7tcgqxhz"
ORDER BY dateAdded

*/




export async function serverRequest(dataToSend,serverfilename){
  




  try{
    const response = await fetch(serverfilename,{
      method: "POST",
      body: JSON.stringify(dataToSend)
    })
  
    const responses = await response.json();

    return responses

  } catch (error){
    console.log('Error:',error);
  }
};