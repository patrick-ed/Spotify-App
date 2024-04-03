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
  $trackArr = $jsonRequest->tracks;
  $userData = $jsonRequest -> userData;
  $response1 = addNewTracks($conn, $trackArr);
  $response2 = connectSavedTracks($conn,$userData);


  //send the JSON response
  echo json_encode($response1);
  //close the connection
  $conn = null;
}

function connectSavedTracks($conn,$userData){

  $response = array("code" => 0, "message" => "");

  $sql = 

  "INSERT INTO 
    usersavedtracks(trackID, userID, dateAdded)
  VALUES 
    (:trackID, :userID, :dateAdded) 
  ON DUPLICATE KEY UPDATE 
    trackID = trackID, 
    userID = userID, 
    dateAdded = dateAdded;
  ";//On a duplicate, update values

  $stmt = $conn->prepare($sql);

  try{
    
    foreach ($userData as $track) {
      
      // Sanitize data
      $trackID = sanitise($track->trackID);
      $userID = sanitise($track->userID);
      $dateAdded = sanitise($track->dateAdded);


      // Bind parameters to the data
      $stmt->bindParam(':trackID', $trackID);
      $stmt->bindParam(':userID', $userID);
      $stmt->bindParam(':dateAdded', $dateAdded);


      // Execute the query
      $stmt->execute();

    }

    $response["code"] = 1;
    $response["message"] = "track connections made";
  }
  catch (PDOException $e){
      $response["code"] = 0;
      $response["message"] = $e->getMessage();
  }

  return $response;

}

function addNewTracks($conn, $trackArr){

  $response = array("code" => 0, "message" => "");

  
  $sql = 

  "INSERT INTO 
    track(trackID, trackName, artist, duration,albumCover) 
  VALUES 
    (:trackID, :trackName, :artist, :duration, :albumCover) 
  ON DUPLICATE KEY UPDATE 
    trackID = trackID, 
    trackName = trackName, 
    artist = artist, 
    duration = duration,
    albumCover = albumCover;
  ";//On a duplicate, update values

  $stmt = $conn->prepare($sql);

  try{
    
    foreach ($trackArr as $track) {
      
      // Sanitize data
      $trackID = sanitise($track->trackID);
      $trackName = sanitise($track->trackName);
      $artist = sanitise($track->artist);
      $duration = sanitise($track->duration);
      $albumCover = sanitise($track->albumCover);

      // Bind parameters to the data
      $stmt->bindParam(':trackID', $trackID);
      $stmt->bindParam(':trackName', $trackName);
      $stmt->bindParam(':artist', $artist);
      $stmt->bindParam(':duration', $duration);
      $stmt->bindParam(':albumCover', $albumCover);

      // Execute the query
      $stmt->execute();

    }

    $response["code"] = 1;
    $response["message"] = "tracks added/updated";
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
    
?>
