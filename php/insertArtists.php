<?php

header("Content-Type: application/json; charset=UTF-8");
main();

function main(){

  require_once '../admin/php/connectToDB.php';
  require_once "../admin/php/sanitise.php";

  // response codes are:
  // code 0 = failure, 1 = success

  // set default response1


  // capture the input of JSON request from client
  $request = file_get_contents('php://input');

  //decode the JSON so it is useable in php
  $jsonRequest = json_decode($request);
  $artistArr = $jsonRequest->artists;
  $generArr = $jsonRequest->genres;
  $response1 = addNewArtist($conn, $artistArr);
  $response = addGenres($conn, $generArr);


  //send the JSON response
  echo json_encode($response);
  //close the connection
  $conn = null;
}


function addGenres($conn, $generArr){

  
  $response = array("code" => 0, "message" => "");
  $sql = 
  "INSERT INTO 
    genreartist(genreID, artistID) 
  VALUES 
    (:genreID, :artistID) 
  ON DUPLICATE KEY UPDATE 
    genreID = genreID, 
    artistID = artistID;
  ";//On a duplicate, update values

  $stmt = $conn->prepare($sql);

  try{
    
    foreach ($generArr as $genre) {
      
      // Sanitize data
      $genreID = sanitise($genre->genreID);
      $artistID = sanitise($genre->artistID);

      // Bind parameters to the data
      $stmt->bindParam(':genreID', $genreID);
      $stmt->bindParam(':artistID', $artistID);



      // Execute the query
      $stmt->execute();

    }

    $response["code"] = 1;
    $response["message"] = "genres added/updated";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }

  return $response;




}

function addNewArtist($conn, $artistArr){

  $response = array("code" => 0, "message" => "");
  $sql = 
  "INSERT INTO 
    artist(artistID, artistName, followers, popularity) 
  VALUES 
    (:artistID, :artistName, :followers, :popularity) 
  ON DUPLICATE KEY UPDATE 
    artistID = artistID, 
    artistName = artistName, 
    followers = followers, 
    popularity = popularity;
  ";//On a duplicate, update values

  $stmt = $conn->prepare($sql);

  try{
    
    foreach ($artistArr as $artist) {
      
      // Sanitize data
      $artistID = sanitise($artist->artistID);
      $artistName = sanitise($artist->name);
      $followers = sanitise($artist->followers);
      $popularity = sanitise($artist->popularity);

      // Bind parameters to the data
      $stmt->bindParam(':artistID', $artistID);
      $stmt->bindParam(':artistName', $artistName);
      $stmt->bindParam(':followers', $followers);
      $stmt->bindParam(':popularity', $popularity);

      // Execute the query
      $stmt->execute();

    }

    $response["code"] = 1;
    $response["message"] = "artists added/updated";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }

  return $response;

}



/*


INSERT INTO track(trackID, trackName, artist,duration)
SELECT :trackID, :trackName, :trackName,:duration
WHERE NOT EXISTS (
	SELECT trackID 
    FROM track 
    WHERE trackID = :trackID
);



INSERT INTO track (trackID, trackName, artist,duration)
  VALUES 
      :allTracks
  ON DUPLICATE KEY UPDATE
      trackID = VALUES(trackID), 
      trackName = VALUES(trackName), 
      artist = VALUES(artist), 
      duration = VALUES(duration)"
      ;

*/
    

/*

  //Selects users saved tracks genres

  SELECT genreartist.genreID
  FROM track,users,usersavedtracks,trackcreatedby,artist,genreartist
  WHERE track.trackID = usersavedtracks.trackID
  AND users.userID = usersavedtracks.userID
  AND trackcreatedby.trackID = track.trackID
  AND trackcreatedby.artistID = artist.artistID
  AND genreartist.artistID = artist.artistID
  AND users.username = "patrick _"

*/

?>
